const fs = require("fs");
const { marked } = require("marked");
const package = JSON.parse(fs.readFileSync("package.json", "utf8"));
const { Liquid } = require("liquidjs");
const engine = new Liquid();

const markdown = fs.readFileSync("README.md", "utf8");
const html = marked.parse(markdown);

engine
  .renderFile("index.liquid", { content: html, project: package })
  .then(console.log);
