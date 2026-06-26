/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsTeaserParser from './parsers/cards-teaser.js';
import cardsKnowhowParser from './parsers/cards-knowhow.js';
import cardsHorizontalParser from './parsers/cards-horizontal.js';
import searchInlineParser from './parsers/search-inline.js';
import cardsPromoParser from './parsers/cards-promo.js';
import tabsKnowhowParser from './parsers/tabs-knowhow.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/grainger-cleanup.js';
import sectionsTransformer from './transformers/grainger-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-teaser': cardsTeaserParser,
  'cards-knowhow': cardsKnowhowParser,
  'cards-horizontal': cardsHorizontalParser,
  'search-inline': searchInlineParser,
  'cards-promo': cardsPromoParser,
  'tabs-knowhow': tabsKnowhowParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'know-how-home',
  description: "Grainger KnowHow content hub homepage: intro text, featured teaser grid, Editor's Picks card columns with inline search, tabbed Most Recent card grids, Popular/Video card columns, and email signup footer.",
  urls: [
    'https://www.grainger.com/know-how',
  ],
  blocks: [
    {
      name: 'cards-teaser',
      instances: ['.responsivegrid.marcom__layout-nested:has(.ss-ext-teaser)'],
    },
    {
      name: 'cards-knowhow',
      instances: [
        '.responsivegrid.marcom__layout-nested:has(.marcom-card--knowHow):first-of-type',
        '.responsivegrid.marcom__layout-nested.aem-GridColumn--default--8:has(.marcom-card--knowHow)',
        '.responsivegrid.marcom__layout-nested.aem-GridColumn--default--4 .ss-card.marcom-card--knowHow',
      ],
    },
    {
      name: 'cards-horizontal',
      instances: ['.responsivegrid.marcom__layout-nested:has(.marcom-card--horizontal)'],
    },
    {
      name: 'search-inline',
      instances: ['.ss-kh-search .kh-SearchFrame'],
    },
    {
      name: 'cards-promo',
      instances: ['.ss-card.marcom-card--imageOnly'],
    },
    {
      name: 'tabs-knowhow',
      instances: ['.ss-tabs.tabs .cmp-tabs'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Intro + Featured Teasers',
      selector: 'div.responsivegrid.marcom__layout-white:nth-of-type(1)',
      style: null,
      blocks: ['cards-teaser'],
      defaultContent: ['.ss-textimage.marcom-textimage-0-100 .content-container'],
    },
    {
      id: 'section-2',
      name: "Editor's Picks",
      selector: 'div.responsivegrid.marcom__layout-white:nth-of-type(2)',
      style: null,
      blocks: ['cards-knowhow', 'cards-horizontal', 'search-inline', 'cards-promo'],
      defaultContent: ['.ss-ext-title.knowhow-section-title .cmp-title__text'],
    },
    {
      id: 'section-3',
      name: 'Most Recent (Tabbed Card Grids)',
      selector: 'div.responsivegrid.marcom__layout-white:nth-of-type(3)',
      style: null,
      blocks: ['tabs-knowhow'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Popular KnowHow + Video',
      selector: 'div.responsivegrid.marcom__layout-white:nth-of-type(4)',
      style: null,
      blocks: ['cards-knowhow'],
      defaultContent: [
        '.responsivegrid.marcom__layout-nested.aem-GridColumn--default--8 .ss-ext-title .cmp-title__text',
        '.responsivegrid.marcom__layout-nested.aem-GridColumn--default--4 .ss-ext-title .cmp-title__text',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

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
        if (seen.has(element)) return; // avoid double-processing across overlapping selectors
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup: strip nav/footer)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by an earlier parser
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

    // 4. afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
