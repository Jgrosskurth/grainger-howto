/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Grainger KnowHow section boundaries.
 *
 * Establishes section breaks between the four content sections of the
 * know-how-home template. Sections are the four
 * `div.responsivegrid.marcom__layout-white` blocks (verified against
 * migration-work/cleaned.html lines 43, 121, 240, 306):
 *   1. Intro + Featured Teasers
 *   2. Editor's Picks
 *   3. Most Recent (Tabbed Card Grids)
 *   4. Popular KnowHow + Video
 *
 * Inserts an <hr> before every section except the first (sections.length - 1
 * breaks total). All sections in the template have style === null, so no
 * Section Metadata blocks are created.
 *
 * Runs in afterTransform only.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (sections.length < 2) return;

    const document = element.ownerDocument || element;

    // The four content sections are the `div.responsivegrid.marcom__layout-white`
    // blocks (cleaned.html lines 43, 121, 240, 306). Selecting them all by the
    // shared class is more robust than per-section `:nth-of-type` selectors,
    // which are fragile because the source DOM interleaves same-tag `div`
    // siblings (nav/footer) among the section divs.
    const sectionEls = Array.from(
      element.querySelectorAll('div.responsivegrid.marcom__layout-white'),
    );

    // Process sections in reverse order so DOM insertions don't shift the
    // positions of sections not yet processed.
    for (let i = sectionEls.length - 1; i >= 0; i -= 1) {
      const sectionEl = sectionEls[i];
      const section = sections[i];

      // Section Metadata block when the template section defines a style.
      // All know-how-home sections have style === null, so this is a no-op
      // here, but kept for correctness if styles are added later.
      if (section && section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.appendChild(metaBlock);
      }

      // Section break before every non-first section.
      if (i > 0) {
        sectionEl.parentNode.insertBefore(document.createElement('hr'), sectionEl);
      }
    }
  }
}
