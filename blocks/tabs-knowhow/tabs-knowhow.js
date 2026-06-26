import { toClassName, decorateBlock, loadBlock } from '../../scripts/aem.js';

/**
 * Converts a nested block table (left in place by the importer) into a decorated
 * EDS block. The "Most Recent" panels each hold a cards-knowhow table that EDS
 * does not auto-decorate because it is nested inside the tabs block.
 * @param {Element} panel The tab panel containing a nested block table
 */
async function decorateNestedBlock(panel) {
  const table = panel.querySelector('table');
  if (!table) return;

  const blockName = toClassName(
    (table.querySelector('thead th, thead td')?.textContent || '').trim(),
  ) || 'cards-knowhow';

  const blockEl = document.createElement('div');
  blockEl.classList.add(blockName);
  table.querySelectorAll('tbody tr').forEach((tr) => {
    const rowEl = document.createElement('div');
    [...tr.children].forEach((td) => {
      const cellEl = document.createElement('div');
      while (td.firstChild) cellEl.append(td.firstChild);
      rowEl.append(cellEl);
    });
    blockEl.append(rowEl);
  });

  const wrapper = document.createElement('div');
  wrapper.append(blockEl);
  table.replaceWith(wrapper);

  decorateBlock(blockEl);
  await loadBlock(blockEl);
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-knowhow-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-knowhow-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-knowhow-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  // Decorate the nested cards block inside each panel (left as a raw table by the importer).
  await Promise.all(
    [...block.querySelectorAll('.tabs-knowhow-panel')].map((panel) => decorateNestedBlock(panel)),
  );
}
