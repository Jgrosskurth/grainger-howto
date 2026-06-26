import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-knowhow-card-image';
      else div.className = 'cards-knowhow-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  // Move the leading category paragraph onto the image as an overlaid chip.
  ul.querySelectorAll('li').forEach((li) => {
    const image = li.querySelector('.cards-knowhow-card-image');
    const body = li.querySelector('.cards-knowhow-card-body');
    if (!image || !body) return;
    const cat = body.querySelector(':scope > p:first-child');
    // Category is the first paragraph that sits before the headline.
    if (cat && cat.nextElementSibling && cat.nextElementSibling.tagName === 'H3') {
      cat.classList.add('cards-knowhow-card-category');
      image.append(cat);
    }
    // Mark the date (last paragraph) for distinct styling.
    const paras = [...body.querySelectorAll(':scope > p')];
    const date = paras[paras.length - 1];
    if (date) date.classList.add('cards-knowhow-card-date');
  });
  block.textContent = '';
  block.append(ul);
}
