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

## 2026-10-11 catalog update

This section records a new run using the Codex in-app browser against the local public/ preview. The preceding Chrome evidence remains historical. Chrome's request-header policy failed to load in this run; the supported in-app browser recovered the UI verification path.

- Rendered DOM snapshots confirm 10 total cards, 7 games, 2 tools and 1 learning entry; searches for the new public creature game and restricted runner each show the correct single card. Combining the creature query with tools shows zero cards; the empty-state reset restores all 10.
- Changing the notes category leaves the works query and single matching card intact. Both restricted entries retain their permission notices before navigation. All 10 links have the reviewed HTTPS URL, target `_blank`, and `noopener noreferrer`; restricted destinations were not opened.
- Desktop content/scroll widths: 1265/1265. Responsive 390 viewport: 375/375. Responsive 320 viewport: 305/305. Screenshots of both new cards show readable titles, summaries, features, locally hosted concept covers and complete actions without horizontal overflow.
- The final local browser error/warning log was empty. Raw snapshots, measurements and screenshots are stored outside the repository under integration-20261011/qa; no new physical-device, mainland-direct, full-gameplay, printing or disabled-JavaScript browser claim is made.
- Early evaluate measurements checked `article.hidden`, but the filter hides each parent `li.work-card`. Those arrays are retained with a correction and are not visibility evidence; final card visibility was verified from rendered DOM snapshots and screenshots. AX's checkbox naming also differed from the DOM's button role; DOM-grounded button locators were used. No website change was needed for these observation issues.
- ESA's console opened a login page. The user explicitly chose to publish first and inspect control-plane logs later. Formal-domain verification and screenshots after publishing are recorded separately in `output/update-20261011/RELEASE-RECORD.md`.
