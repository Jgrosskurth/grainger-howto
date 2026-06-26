/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-know-how-home.js
  var import_know_how_home_exports = {};
  __export(import_know_how_home_exports, {
    default: () => import_know_how_home_default
  });

  // tools/importer/parsers/cards-teaser.js
  function parse(element, { document }) {
    const cells = [];
    const teasers = element.querySelectorAll(".ss-ext-teaser, .teaser");
    teasers.forEach((teaser) => {
      const img = teaser.querySelector(".cmp-teaser__image img, img.cmp-image__image, img");
      const bodyContent = [];
      const pretitle = teaser.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
      if (pretitle) {
        const eyebrow = document.createElement("p");
        eyebrow.textContent = pretitle.textContent.trim();
        bodyContent.push(eyebrow);
      }
      const titleLink = teaser.querySelector(".cmp-teaser__title-link, .cmp-teaser__title a, h2 a, h3 a");
      const titleEl = teaser.querySelector(".cmp-teaser__title, h2, h3");
      if (titleLink) {
        const heading = document.createElement("h3");
        const link = document.createElement("a");
        link.href = titleLink.getAttribute("href") || "#";
        link.textContent = titleLink.textContent.trim();
        heading.appendChild(link);
        bodyContent.push(heading);
      } else if (titleEl) {
        const heading = document.createElement("h3");
        heading.textContent = titleEl.textContent.trim();
        bodyContent.push(heading);
      }
      if (img || bodyContent.length) {
        cells.push([img || "", bodyContent.length ? bodyContent : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-knowhow.js
  function parse2(element, { document }) {
    const cards = element.matches(".ss-card.marcom-card--knowHow, .ss-card") ? [element] : Array.from(element.querySelectorAll(".ss-card.marcom-card--knowHow, .ss-card"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".tester img, .marcom-card--container img, img");
      const textContent = [];
      const category = card.querySelector(".marcom-card--headCopy .marcom-card--subHead, .marcom-card--subHead");
      if (category && category.textContent.trim()) {
        const eyebrow = document.createElement("p");
        eyebrow.textContent = category.textContent.trim();
        textContent.push(eyebrow);
      }
      const headline = card.querySelector(".marcom-card--headline");
      if (headline && headline.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = headline.textContent.trim();
        textContent.push(h);
      }
      const resP = card.querySelector(".marcom-card--resP");
      let dateText = "";
      if (resP) {
        resP.querySelectorAll("p").forEach((p) => {
          if (p.classList.contains("marcom-card--date")) {
            dateText = p.textContent.trim();
          } else if (p.textContent.trim()) {
            const desc = document.createElement("p");
            desc.textContent = p.textContent.trim();
            textContent.push(desc);
          }
        });
      }
      if (!dateText) {
        const dateEl = card.querySelector(".marcom-card--date");
        if (dateEl) dateText = dateEl.textContent.trim();
      }
      if (dateText) {
        const date = document.createElement("p");
        date.textContent = dateText;
        textContent.push(date);
      }
      const linkEl = card.querySelector("a.marcom-card--link, a[href]");
      if (linkEl && linkEl.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = linkEl.getAttribute("href");
        link.textContent = headline ? headline.textContent.trim() : "Read more";
        textContent.push(link);
      }
      if (img || textContent.length) {
        cells.push([img || "", textContent.length ? textContent : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-knowhow", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-horizontal.js
  function parse3(element, { document }) {
    const cards = element.matches(".ss-card.marcom-card--horizontal, .ss-card") ? [element] : Array.from(element.querySelectorAll(".ss-card.marcom-card--horizontal, .ss-card"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".tester img, .marcom-card--container img, img");
      const textContent = [];
      const category = card.querySelector(".marcom-card--headCopy .marcom-card--subHead, .marcom-card--subHead");
      if (category && category.textContent.trim()) {
        const eyebrow = document.createElement("p");
        eyebrow.textContent = category.textContent.trim();
        textContent.push(eyebrow);
      }
      const headline = card.querySelector(".marcom-card--headline");
      if (headline && headline.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = headline.textContent.trim();
        textContent.push(h);
      }
      const linkEl = card.querySelector("a.marcom-card--link, a[href]");
      if (linkEl && linkEl.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = linkEl.getAttribute("href");
        link.textContent = headline ? headline.textContent.trim() : "Read more";
        textContent.push(link);
      }
      if (img || textContent.length) {
        cells.push([img || "", textContent.length ? textContent : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-horizontal", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/search-inline.js
  var QUERY_INDEX_URL = "https://main--grainger-howto--Jgrosskurth.aem.page/query-index.json";
  function parse4(element, { document }) {
    const cells = [];
    const titleEl = element.querySelector('.kh-SearchFrame-Title, h1, h2, h3, [class*="Title"]');
    if (titleEl && titleEl.textContent.trim()) {
      const heading = document.createElement("h2");
      heading.textContent = titleEl.textContent.trim();
      cells.push([heading]);
    }
    const link = document.createElement("a");
    link.href = QUERY_INDEX_URL;
    link.textContent = QUERY_INDEX_URL;
    cells.push([link]);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "search-inline", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse5(element, { document }) {
    const cards = element.matches(".ss-card.marcom-card--imageOnly, .ss-card") ? [element] : Array.from(element.querySelectorAll(".ss-card.marcom-card--imageOnly, .ss-card"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".tester img, .marcom-card--container img, img");
      if (!img) return;
      const linkEl = card.querySelector("a.marcom-card--link, a[href]");
      const href = linkEl && linkEl.getAttribute("href");
      let cellContent = img;
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.appendChild(img);
        cellContent = link;
      }
      cells.push([cellContent]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-knowhow.js
  function buildCardsKnowhow(panel, document) {
    const cards = Array.from(panel.querySelectorAll(".marcom-card--container.marcom-card--knowHow, .ss-card.marcom-card--knowHow, .marcom-card--container"));
    const cardCells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".tester img, img");
      const textContent = [];
      const category = card.querySelector(".marcom-card--khCat .marcom-card--subHead, .marcom-card--headCopy .marcom-card--subHead, .marcom-card--subHead");
      if (category && category.textContent.trim()) {
        const eyebrow = document.createElement("p");
        eyebrow.textContent = category.textContent.trim();
        textContent.push(eyebrow);
      }
      const headline = card.querySelector(".marcom-card--headline");
      if (headline && headline.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = headline.textContent.trim();
        textContent.push(h);
      }
      const resP = card.querySelector(".marcom-card--resP");
      let dateText = "";
      if (resP) {
        resP.querySelectorAll("p").forEach((p) => {
          if (p.classList.contains("marcom-card--date")) {
            dateText = p.textContent.trim();
          } else if (p.textContent.trim()) {
            const desc = document.createElement("p");
            desc.textContent = p.textContent.trim();
            textContent.push(desc);
          }
        });
      }
      if (dateText) {
        const date = document.createElement("p");
        date.textContent = dateText;
        textContent.push(date);
      }
      const linkEl = card.querySelector("a.marcom-card--link, a[href]");
      if (linkEl && linkEl.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = linkEl.getAttribute("href");
        link.textContent = headline ? headline.textContent.trim() : "Read more";
        textContent.push(link);
      }
      if (img || textContent.length) {
        cardCells.push([img || "", textContent.length ? textContent : ""]);
      }
    });
    if (!cardCells.length) return null;
    return WebImporter.Blocks.createBlock(document, { name: "cards-knowhow", cells: cardCells });
  }
  function parse6(element, { document }) {
    const labels = Array.from(element.querySelectorAll(".cmp-tabs__tablist > .cmp-tabs__tab, .cmp-tabs__tab"));
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    const cells = [];
    labels.forEach((labelEl, i) => {
      const labelText = labelEl.textContent.trim();
      const label = document.createElement("p");
      label.textContent = labelText;
      let panel = panels[i];
      if (!panel && labelEl.classList.contains("cmp-tabs__tab--active")) {
        panel = element.querySelector(".cmp-tabs__tabpanel--active");
      }
      let contentCell = "";
      if (panel) {
        const nested = buildCardsKnowhow(panel, document);
        if (nested) contentCell = nested;
      }
      cells.push([label, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-knowhow", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/grainger-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".ss-kh-top-nav",
        ".ss-kh-footer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "script",
        "style"
      ]);
      element.querySelectorAll("[data-cmp-is]").forEach((el) => {
        el.removeAttribute("data-cmp-is");
      });
    }
  }

  // tools/importer/transformers/grainger-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      if (sections.length < 2) return;
      const document = element.ownerDocument || element;
      const sectionEls = Array.from(
        element.querySelectorAll("div.responsivegrid.marcom__layout-white")
      );
      for (let i = sectionEls.length - 1; i >= 0; i -= 1) {
        const sectionEl = sectionEls[i];
        const section = sections[i];
        if (section && section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.appendChild(metaBlock);
        }
        if (i > 0) {
          sectionEl.parentNode.insertBefore(document.createElement("hr"), sectionEl);
        }
      }
    }
  }

  // tools/importer/import-know-how-home.js
  var parsers = {
    "cards-teaser": parse,
    "cards-knowhow": parse2,
    "cards-horizontal": parse3,
    "search-inline": parse4,
    "cards-promo": parse5,
    "tabs-knowhow": parse6
  };
  var PAGE_TEMPLATE = {
    name: "know-how-home",
    description: "Grainger KnowHow content hub homepage: intro text, featured teaser grid, Editor's Picks card columns with inline search, tabbed Most Recent card grids, Popular/Video card columns, and email signup footer.",
    urls: [
      "https://www.grainger.com/know-how"
    ],
    blocks: [
      {
        name: "cards-teaser",
        instances: [".responsivegrid.marcom__layout-nested:has(.ss-ext-teaser)"]
      },
      {
        name: "cards-knowhow",
        instances: [
          ".responsivegrid.marcom__layout-nested:has(.marcom-card--knowHow):first-of-type",
          ".responsivegrid.marcom__layout-nested.aem-GridColumn--default--8:has(.marcom-card--knowHow)",
          ".responsivegrid.marcom__layout-nested.aem-GridColumn--default--4 .ss-card.marcom-card--knowHow"
        ]
      },
      {
        name: "cards-horizontal",
        instances: [".responsivegrid.marcom__layout-nested:has(.marcom-card--horizontal)"]
      },
      {
        name: "search-inline",
        instances: [".ss-kh-search .kh-SearchFrame"]
      },
      {
        name: "cards-promo",
        instances: [".ss-card.marcom-card--imageOnly"]
      },
      {
        name: "tabs-knowhow",
        instances: [".ss-tabs.tabs .cmp-tabs"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Intro + Featured Teasers",
        selector: "div.responsivegrid.marcom__layout-white:nth-of-type(1)",
        style: null,
        blocks: ["cards-teaser"],
        defaultContent: [".ss-textimage.marcom-textimage-0-100 .content-container"]
      },
      {
        id: "section-2",
        name: "Editor's Picks",
        selector: "div.responsivegrid.marcom__layout-white:nth-of-type(2)",
        style: null,
        blocks: ["cards-knowhow", "cards-horizontal", "search-inline", "cards-promo"],
        defaultContent: [".ss-ext-title.knowhow-section-title .cmp-title__text"]
      },
      {
        id: "section-3",
        name: "Most Recent (Tabbed Card Grids)",
        selector: "div.responsivegrid.marcom__layout-white:nth-of-type(3)",
        style: null,
        blocks: ["tabs-knowhow"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Popular KnowHow + Video",
        selector: "div.responsivegrid.marcom__layout-white:nth-of-type(4)",
        style: null,
        blocks: ["cards-knowhow"],
        defaultContent: [
          ".responsivegrid.marcom__layout-nested.aem-GridColumn--default--8 .ss-ext-title .cmp-title__text",
          ".responsivegrid.marcom__layout-nested.aem-GridColumn--default--4 .ss-ext-title .cmp-title__text"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements;
        try {
          elements = document.querySelectorAll(selector);
        } catch (e) {
          console.warn(`Invalid selector for "${blockDef.name}": ${selector}`, e.message);
          return;
        }
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_know_how_home_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_know_how_home_exports);
})();
