import { marked } from "marked";
import markedFootnote from "marked-magickcss-sidenote";
import { gfmHeadingId } from "marked-gfm-heading-id";
import project from "./package.json" with { type: "json" };
import { Liquid } from "liquidjs";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);
const engine = new Liquid();

marked.use({
  gfm: true,
});

const parser = marked.use(markedFootnote()).use(gfmHeadingId());

engine.registerFilter("markdown", parser.parse);
engine.registerFilter("safe", purify.sanitize);

engine.renderFile("index.liquid", { project: project }).then(console.log);
