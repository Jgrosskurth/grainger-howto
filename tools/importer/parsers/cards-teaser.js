/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-teaser. Base block: cards.
 * Source: https://www.grainger.com/know-how
 * Generated: 2026-06-25
 *
 * Structure (from library-description.txt + blockStructures):
 *   2 columns. Each teaser = 1 row: image cell + body cell.
 *   Body cell holds the category eyebrow (pretitle) + headline link.
 *
 * Source DOM: a responsivegrid containing multiple `.ss-ext-teaser` items,
 *   each with `.cmp-teaser__image a img` and `.cmp-teaser__content`
 *   (`.cmp-teaser__pretitle` + `h2.cmp-teaser__title > a.cmp-teaser__title-link`).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each featured teaser tile is one card row.
  const teasers = element.querySelectorAll('.ss-ext-teaser, .teaser');
  teasers.forEach((teaser) => {
    // Image cell: prefer the actual <img>; fall back to the linked image wrapper.
    const img = teaser.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

    // Body cell: category eyebrow + headline link.
    const bodyContent = [];

    const pretitle = teaser.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
    if (pretitle) {
      const eyebrow = document.createElement('p');
      eyebrow.textContent = pretitle.textContent.trim();
      bodyContent.push(eyebrow);
    }

    // Headline as a heading containing the link (preserve href).
    const titleLink = teaser.querySelector('.cmp-teaser__title-link, .cmp-teaser__title a, h2 a, h3 a');
    const titleEl = teaser.querySelector('.cmp-teaser__title, h2, h3');
    if (titleLink) {
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href') || '#';
      link.textContent = titleLink.textContent.trim();
      heading.appendChild(link);
      bodyContent.push(heading);
    } else if (titleEl) {
      const heading = document.createElement('h3');
      heading.textContent = titleEl.textContent.trim();
      bodyContent.push(heading);
    }

    // Only emit a row when there is meaningful content.
    if (img || bodyContent.length) {
      cells.push([img || '', bodyContent.length ? bodyContent : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
