# Browser acceptance record

Evidence: 2026-10-06, Asia/Shanghai. Browser: Chrome through the connected browser tool; responsive viewport overrides, not physical mobile devices. Local page served from public/ at loopback. Raw checks and screenshots are retained in local release evidence; this file contains the public-safe results.

## Completed local checks

- All 8 unique cards rendered. Filters returned 8 total, 5 games, 2 tools and 1 restricted learning entry.
- Combined category/query, no results, clear button, empty-state reset, mixed case, surrounding whitespace, blank query and one-character Chinese query worked.
- Notes category/search controls remained independent from the works directory. Notes remain empty; no restricted note content was opened or copied.
- All 8 card URLs matched the reviewed Sites inventory. External links use a new tab with noopener and noreferrer; the learning entry shows the permission notice before navigation. Clicking the YourWar action also opened a new tab at its exact reviewed URL.
- All 8 card images decoded in the browser after scrolling. All are labeled concept artwork rather than screenshots.
- Keyboard Tab from work search reached the first card action, with a visible 2px solid focus outline.
- 1440 desktop, 768 tablet, 390 and 320 mobile-width layouts inspected. After the footer correction, narrow viewport scrollWidth equals clientWidth (320: 305/305; 768: 753/753). The 390 overflow assertion also passed. No horizontal overflow remains in the checked viewports.
- The 320 restricted card showed its full title, description, features, permission notice and action. Mobile category and keyword search/reset worked.
- Browser error/warning log was empty during the final local check.

## Findings and repairs

A 390px viewport initially exposed 4px of horizontal overflow from the rotated footer arrow. The arrow now reserves its transformed width; the action does not shrink and the sibling paragraph can shrink. No global overflow hiding was added. Build and its 22 tests were rerun by implementation; the 390/320 browser checks above were then rerun successfully.

One early automated click on the empty-state reset did not activate while smooth scrolling was in progress. The stable page was inspected and the same visible button clicked successfully; subsequent reset checks passed. No code failure or browser exception was observed. This initial automation miss is retained in raw evidence.

Full-page screenshot capture timed out; viewport screenshots were successfully saved for desktop, mobile, restricted entry and footer views. This did not block DOM or interaction checks.

## Pending release checks

The production commit, ESA build/deployment and formal-domain resource hashes are recorded after the authorized main push in the ignored local project records output/RELEASE-RECORD.md and output/live-verification.json. This pre-push browser record is not deployment evidence. Real-device touch behavior, mainland direct access and the full gameplay/backend of external Sites are outside the checks performed here.
