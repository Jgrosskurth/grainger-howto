/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base block: cards.
 * Source: https://www.grainger.com/know-how
 * Generated: 2026-06-25
 *
 * Structure (from blockStructures):
 *   Single row, image cell only (linked, no text). Borderless promo tile.
 *
 * Source DOM: `.ss-card.marcom-card--imageOnly` containing
 *   `.tester img` and a wrapping `a.marcom-card--link[href]`.
 *   The image is surfaced as a linked image so the click target is preserved.
 *
 * Matched element may be the card itself OR a container — handle both.
 */
export default function parse(element, { document }) {
  const cards = element.matches('.ss-card.marcom-card--imageOnly, .ss-card')
    ? [element]
    : Array.from(element.querySelectorAll('.ss-card.marcom-card--imageOnly, .ss-card'));

  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.tester img, .marcom-card--container img, img');
    if (!img) return;

    const linkEl = card.querySelector('a.marcom-card--link, a[href]');
    const href = linkEl && linkEl.getAttribute('href');

    let cellContent = img;
    if (href) {
      // Wrap the image in its link to keep the promo tile clickable.
      const link = document.createElement('a');
      link.href = href;
      link.appendChild(img);
      cellContent = link;
    }

    // Single-column row: one cell holding the (linked) image.
    cells.push([cellContent]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
