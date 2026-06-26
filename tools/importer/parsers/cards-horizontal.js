/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-horizontal. Base block: cards.
 * Source: https://www.grainger.com/know-how
 * Generated: 2026-06-25
 *
 * Structure (from library-description.txt + blockStructures):
 *   2 columns. Each card = 1 row: side thumbnail cell + text cell.
 *   Text cell holds: category eyebrow, headline, link. Stacked horizontal list.
 *
 * Source DOM: `.ss-card.marcom-card--horizontal`, each with
 *   `.tester img` (thumbnail), `.marcom-card--headCopy` (subHead + headline),
 *   and a wrapping `a.marcom-card--link[href]`.
 *
 * Matched element may be the grid container OR a card itself — handle both.
 */
export default function parse(element, { document }) {
  const cards = element.matches('.ss-card.marcom-card--horizontal, .ss-card')
    ? [element]
    : Array.from(element.querySelectorAll('.ss-card.marcom-card--horizontal, .ss-card'));

  const cells = [];

  cards.forEach((card) => {
    // Thumbnail cell.
    const img = card.querySelector('.tester img, .marcom-card--container img, img');

    // Text cell content: category, headline, link.
    const textContent = [];

    const category = card.querySelector('.marcom-card--headCopy .marcom-card--subHead, .marcom-card--subHead');
    if (category && category.textContent.trim()) {
      const eyebrow = document.createElement('p');
      eyebrow.textContent = category.textContent.trim();
      textContent.push(eyebrow);
    }

    const headline = card.querySelector('.marcom-card--headline');
    if (headline && headline.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = headline.textContent.trim();
      textContent.push(h);
    }

    // Link (whole card is a wrapping anchor with empty text — label from headline).
    const linkEl = card.querySelector('a.marcom-card--link, a[href]');
    if (linkEl && linkEl.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = linkEl.getAttribute('href');
      link.textContent = headline ? headline.textContent.trim() : 'Read more';
      textContent.push(link);
    }

    if (img || textContent.length) {
      cells.push([img || '', textContent.length ? textContent : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-horizontal', cells });
  element.replaceWith(block);
}
