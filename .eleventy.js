const interlinker = require("@photogabble/eleventy-plugin-interlinker");
const cheerio = require("cheerio");
const mime = require("mime-types");
const markdownIt = require("markdown-it");

const project = require("./package.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(interlinker, {
    defaultLayout: "embed.liquid",
    deadLinkReport: "none",
    resolvingFns: new Map([
      ["default", ignorePrivateLore],
      ["404-embed", embedImages],
    ]),
  });

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    }),
  );

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("lore/*.jpg");
  eleventyConfig.addPassthroughCopy("lore/*.jpeg");
  eleventyConfig.addPassthroughCopy("lore/*.png");
  eleventyConfig.addPassthroughCopy("lore/*.webp");
  eleventyConfig.addPassthroughCopy("lore/*.svg");

  eleventyConfig.addCollection("lore", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("lore/**")
      .filter((lore) => lore.data.common)
      .map(useFileNameForTitle)
      .map(readHashtags)
      .sort(byTitle);
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/@lit": "vendor/@lit",
    "node_modules/vellum-doc": "vendor/vellum-doc",
    "node_modules/@grislyeye/link-preview": "vendor/link-preview",
    "node_modules/vellum-sidebar": "vendor/vellum-sidebar",
    "node_modules/magick.css": "vendor/magick.css",
    "node_modules/normalize.css": "vendor/normalize.css",
  });

  eleventyConfig.addGlobalData("project", project);

  eleventyConfig.addTransform("link-preview", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      const $ = cheerio.load(content);
      $('a[href^="#"]').wrap("<link-preview></link-preview>");
      return $.html();
    }

    return content;
  });

  eleventyConfig.addFilter("preview", (value, preview) => {
    if (preview && !isNaN(preview)) {
      const $ = cheerio.load(value);
      $(`body > *:nth-child(n + ${preview})`).remove();
      return $.html();
    } else {
      return value;
    }
  });

  eleventyConfig.addFilter("standard-markdown", (value) => {
    return removeObsidianMarkdown(value);
  });
};

function embedImages(link) {
  const mimeType = mime.lookup(link.name);

  if (mimeType && mimeType.startsWith("image/")) {
    return `<img src="../${link.name}">`;
  }

  return "";
}

function ignorePrivateLore(link) {
  if (link.exists && link.page.data.common) {
    return `<link-preview><a href="${link.href}">${link.name}</a></link-preview>`;
  }

  return `<strong>${link.name}</strong>`;
}

function byTitle(a, b) {
  return a.data.title.localeCompare(b.data.title);
}

function useFileNameForTitle(lore) {
  var fileName = lore.inputPath.split("/").at(-1);
  lore.data.title = fileName.split(".").at(0);
  return lore;
}

const hashtags = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_-]{1,30})(\b|\r)/g;
const footnotes = /\^\w+/g;

function readHashtags(lore) {
  lore.data.tags = lore.data.tags
    ? lore.data.tags.concat([...lore.rawInput.matchAll(hashtags)])
    : [...lore.rawInput.matchAll(hashtags)];

  return lore;
}

function removeObsidianMarkdown(markdown) {
  return markdown.replace(hashtags, "").replace(footnotes, "");
}
