import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Tag the signup bar and copyright sections by content, since the published
  // fragment does not carry these classes.
  const emailLink = footer.querySelector('a[href*="email-signup"]');
  let signup = footer.querySelector('.footer-signup');
  if (!signup && emailLink) {
    signup = emailLink.closest('.default-content-wrapper, div');
    if (signup) signup.classList.add('footer-signup');
  }
  const copyright = [...footer.querySelectorAll('.default-content-wrapper, div')]
    .find((el) => /All Rights Reserved/i.test(el.textContent) && !el.querySelector('div'));
  if (copyright) copyright.classList.add('footer-copyright');

  // Build the email signup form in the top bar (form controls live in JS, not the fragment).
  if (signup) {
    const cta = signup.querySelector('a');
    const ctaHref = cta ? cta.getAttribute('href') : '#';
    const form = document.createElement('form');
    form.className = 'footer-signup-form';
    form.setAttribute('action', ctaHref);
    const input = document.createElement('input');
    input.type = 'email';
    input.name = 'email';
    input.placeholder = 'Email Address';
    input.setAttribute('aria-label', 'Email Address');
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Sign Up';
    form.append(input, submit);
    // Replace the plain CTA link with the input + button form.
    if (cta && cta.parentElement) cta.parentElement.remove();
    signup.append(form);
  }

  block.append(footer);
}
