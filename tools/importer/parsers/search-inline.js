/* eslint-disable */
/* global WebImporter */
/**
 * Parser for search-inline. Base block: search.
 * Source: https://www.grainger.com/know-how
 * Generated: 2026-06-25
 *
 * Structure (from library-description.txt + blockStructures):
 *   1 column. The search block renders its own input + submit UI; the author
 *   supplies a query-index URL. We preserve the inline title heading and emit
 *   an absolute query-index URL row that the EDS search block consumes.
 *
 * Source DOM: `.kh-SearchFrame` with `h2.kh-SearchFrame-Title`, a text input
 *   and a submit button. The raw <form>/<input> are intentionally NOT carried
 *   over — the EDS search block builds its own query box at runtime.
 */
const QUERY_INDEX_URL = 'https://main--grainger-howto--Jgrosskurth.aem.page/query-index.json';

export default function parse(element, { document }) {
  const cells = [];

  // Preserve the inline title as a heading (default content above the search box).
  const titleEl = element.querySelector('.kh-SearchFrame-Title, h1, h2, h3, [class*="Title"]');
  if (titleEl && titleEl.textContent.trim()) {
    const heading = document.createElement('h2');
    heading.textContent = titleEl.textContent.trim();
    cells.push([heading]);
  }

  // Query-index URL row — what the EDS search block actually consumes.
  const link = document.createElement('a');
  link.href = QUERY_INDEX_URL;
  link.textContent = QUERY_INDEX_URL;
  cells.push([link]);

  // Empty-block guard — there is always at least the query-index row, so this
  // only triggers if the source element is somehow not a search frame.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'search-inline', cells });
  element.replaceWith(block);
}
