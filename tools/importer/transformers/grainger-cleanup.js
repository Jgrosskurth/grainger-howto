/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Grainger KnowHow site-wide cleanup.
 *
 * Removes non-authorable site chrome (top nav, footer) and strips the empty
 * AEM Sites grid wrapper cruft so the import contains only page-level
 * authorable content.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove non-authorable site chrome BEFORE block parsing so it can never
    // be picked up as block content.
    // - .ss-kh-top-nav: top navigation (logos, SHOP NOW, section links).
    //   Header is auto-populated in EDS. (cleaned.html line 20)
    // - .ss-kh-footer: footer (email signup, link columns, social, copyright).
    //   Footer is auto-populated in EDS. (cleaned.html line 371)
    WebImporter.DOMUtils.remove(element, [
      '.ss-kh-top-nav',
      '.ss-kh-footer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Strip leftover non-authorable elements.
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'script',
      'style',
    ]);

    // Clean up AEM Sites grid framework attributes that carry no authorable
    // value. These classes/attributes are layout cruft from the source CMS
    // (div.aem-Grid, aem-GridColumn wrappers, responsivegrid containers).
    element.querySelectorAll('[data-cmp-is]').forEach((el) => {
      el.removeAttribute('data-cmp-is');
    });
  }
}
