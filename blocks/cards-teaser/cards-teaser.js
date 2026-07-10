import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-teaser-card-image';
      else div.className = 'cards-teaser-card-body';
    });
    ul.append(li);
  });
  // The first teaser is the largest above-the-fold image (LCP candidate):
  // load it eagerly with responsive breakpoints; lazy-load the rest.
  ul.querySelectorAll('picture > img').forEach((img, i) => {
    const eager = i === 0;
    const breakpoints = eager
      ? [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]
      : [{ width: '750' }];
    const optimizedPic = createOptimizedPicture(img.src, img.alt, eager, breakpoints);
    if (eager) optimizedPic.querySelector('img')?.setAttribute('fetchpriority', 'high');
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
