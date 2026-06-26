/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-knowhow. Base block: cards.
 * Source: https://www.grainger.com/know-how
 * Generated: 2026-06-25
 *
 * Structure (from library-description.txt + blockStructures):
 *   2 columns. Each card = 1 row: image cell + text cell.
 *   Text cell holds: category eyebrow, headline, description, date, link.
 *
 * Source DOM: `.ss-card.marcom-card--knowHow`, each containing
 *   `.tester img` (image), `.marcom-card--headCopy` (subHead + headline),
 *   `.marcom-card--resP` (description paragraph + `.marcom-card--date`),
 *   and a wrapping `a.marcom-card--link[href]`.
 *
 * The matched element may be the card itself (single-card instances) OR a
 * grid container holding multiple cards — handle both.
 */
export default function parse(element, { document }) {
  const cards = element.matches('.ss-card.marcom-card--knowHow, .ss-card')
    ? [element]
    : Array.from(element.querySelectorAll('.ss-card.marcom-card--knowHow, .ss-card'));

  const cells = [];

  cards.forEach((card) => {
    // Image cell.
    const img = card.querySelector('.tester img, .marcom-card--container img, img');

    // Text cell content.
    const textContent = [];

    // Category eyebrow — prefer the one inside the head copy to avoid the
    // duplicate that also appears in the image overlay (.marcom-card--khCat).
    const category = card.querySelector('.marcom-card--headCopy .marcom-card--subHead, .marcom-card--subHead');
    if (category && category.textContent.trim()) {
      const eyebrow = document.createElement('p');
      eyebrow.textContent = category.textContent.trim();
      textContent.push(eyebrow);
    }

    // Headline as a heading.
    const headline = card.querySelector('.marcom-card--headline');
    if (headline && headline.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = headline.textContent.trim();
      textContent.push(h);
    }

    // Description paragraph(s) — exclude the date paragraph.
    const resP = card.querySelector('.marcom-card--resP');
    let dateText = '';
    if (resP) {
      resP.querySelectorAll('p').forEach((p) => {
        if (p.classList.contains('marcom-card--date')) {
          dateText = p.textContent.trim();
        } else if (p.textContent.trim()) {
          const desc = document.createElement('p');
          desc.textContent = p.textContent.trim();
          textContent.push(desc);
        }
      });
    }

    // Date.
    if (!dateText) {
      const dateEl = card.querySelector('.marcom-card--date');
      if (dateEl) dateText = dateEl.textContent.trim();
    }
    if (dateText) {
      const date = document.createElement('p');
      date.textContent = dateText;
      textContent.push(date);
    }

    // Link (the whole card is wrapped in an anchor; surface it as a CTA).
    const linkEl = card.querySelector('a.marcom-card--link, a[href]');
    if (linkEl && linkEl.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = linkEl.getAttribute('href');
      // Anchor text is empty in source; label it from the headline for a usable CTA.
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-knowhow', cells });
  element.replaceWith(block);
}
