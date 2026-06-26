/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-knowhow. Base block: tabs.
 * Source: https://www.grainger.com/know-how
 * Generated: 2026-06-25
 *
 * Structure (from library-description.txt + blockStructures):
 *   2 columns. Each tab = 1 row: tab label cell + tab content cell.
 *   The tab content body is a nested cards-knowhow block (one inner table per
 *   panel) built from the panel's `.marcom-card--container.marcom-card--knowHow`
 *   cards.
 *
 * Source DOM: `.cmp-tabs` with an `ol.cmp-tabs__tablist > li.cmp-tabs__tab`
 *   label list and `div.cmp-tabs__tabpanel` panels. In the cached source only
 *   the active SAFETY & HEALTH panel is materialized (3 cards); the other tabs
 *   have labels but no panel content — emit those rows with an empty content
 *   cell so the table stays well-formed.
 */

// Build a nested cards-knowhow block table element from a tab panel's cards.
function buildCardsKnowhow(panel, document) {
  const cards = Array.from(panel.querySelectorAll('.marcom-card--container.marcom-card--knowHow, .ss-card.marcom-card--knowHow, .marcom-card--container'));
  const cardCells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.tester img, img');
    const textContent = [];

    const category = card.querySelector('.marcom-card--khCat .marcom-card--subHead, .marcom-card--headCopy .marcom-card--subHead, .marcom-card--subHead');
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
    if (dateText) {
      const date = document.createElement('p');
      date.textContent = dateText;
      textContent.push(date);
    }

    const linkEl = card.querySelector('a.marcom-card--link, a[href]');
    if (linkEl && linkEl.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = linkEl.getAttribute('href');
      link.textContent = headline ? headline.textContent.trim() : 'Read more';
      textContent.push(link);
    }

    if (img || textContent.length) {
      cardCells.push([img || '', textContent.length ? textContent : '']);
    }
  });

  if (!cardCells.length) return null;
  return WebImporter.Blocks.createBlock(document, { name: 'cards-knowhow', cells: cardCells });
}

export default function parse(element, { document }) {
  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab, .cmp-tabs__tab'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];

  labels.forEach((labelEl, i) => {
    // Tab label cell.
    const labelText = labelEl.textContent.trim();
    const label = document.createElement('p');
    label.textContent = labelText;

    // Tab content cell: nested cards-knowhow block when a panel is materialized.
    // Panels appear in tab order; the active panel may be the only one present.
    let panel = panels[i];
    if (!panel && labelEl.classList.contains('cmp-tabs__tab--active')) {
      panel = element.querySelector('.cmp-tabs__tabpanel--active');
    }

    let contentCell = '';
    if (panel) {
      const nested = buildCardsKnowhow(panel, document);
      if (nested) contentCell = nested;
    }

    cells.push([label, contentCell]);
  });

  // Empty-block guard: if there were no labels at all, unwrap.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-knowhow', cells });
  element.replaceWith(block);
}
