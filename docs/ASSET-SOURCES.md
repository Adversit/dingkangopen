# Portfolio asset sources

Updated: 2026-10-06 (Asia/Shanghai).

## Public-use provenance

The six new covers were created for this portfolio at the site owner's request using the built-in OpenAI ImageGen tool. Art direction and prompts were prepared for the Night Voyage Lab visual identity: dark green, restrained lemon-yellow highlights, miniature scenes, and cinematic lighting. Each cover was generated in its own call. No third-party photographs, stock illustrations, game screenshots, private notes, account details, or externally hosted image services were used as inputs. The existing portfolio covers were inspected only to understand the established visual style.

These are **AI-generated concept covers**, not product screenshots or evidence of implemented game graphics. Display an explicit concept-cover label near the gallery imagery. Their role is to identify a project's theme. Do not use the art to claim unverified functionality or expose private project content. Generated outputs remain subject to the applicable tool terms; this record does not assert an exclusive copyright or substitute an unverified stock license.

Only optimized WebP assets are included in the public project. Source PNGs and local generation receipts are intentionally excluded from this repository and its deployment allowlist.

## New cover files

Every primary file is 1200 x 750 pixels; every `-640.webp` variant is 640 x 400 pixels. All paths below are relative to `public/assets/images/`.

| Primary file | Intended use | Primary bytes | 640px bytes |
| --- | --- | ---: | ---: |
| `roommate-housekeeper.webp` | Shared apartment, expenses and chores | 88,444 | 34,168 |
| `mistbound-letters.webp` | Sea-island correspondence adventure | 117,060 | 42,920 |
| `moonlit-immortal.webp` | Eastern fantasy cultivation adventure | 128,016 | 45,598 |
| `yunque-sanguo.webp` | Eastern fantasy card and strategy game | 163,330 | 58,842 |
| `agent-journey.webp` | Agent learning and architecture | 46,656 | 17,368 |
| `ai-collaboration.webp` | Human and AI collaboration | 81,638 | 31,912 |

The six primary files total **625,144 bytes**. The six small variants total **230,808 bytes**. All 12 new files total **855,952 bytes** (below the 1,000,000-byte budget).

Encoding: WebP quality 82, method 6. Generated source dimensions were 1586 x 992. Lanczos resizing and a negligible centered aspect-ratio fit produce exact 16:10 variants; no scene elements were added or composited during conversion.

## Reused concept covers

- `hero-yourwar.webp` and `hero-yourwar-960.webp`: existing YourWar concept art, retained byte-for-byte. Original project import tooling identifies this as user-confirmed ImageGen concept artwork, not an actual game screenshot.
- `pocket-arcade.webp` and `pocket-arcade-720.webp`: existing arcade concept art, retained byte-for-byte. The same original import record identifies it as user-confirmed ImageGen concept artwork.

The original generation prompts for those two existing covers were not established by the inspected import record, so they are not reconstructed here. No private source locations are published.

## Asset validation record

Evidence date: 2026-10-06 (Asia/Shanghai). Scope is image assets only; page behavior, site links, deployment, and final browser acceptance are separate checks.

- All 12 new WebP files were reopened and fully decoded successfully using Pillow 10.4.0.
- Exact format and dimensions were asserted for every new variant.
- Combined byte size was asserted below 1,000,000 bytes.
- All four reused WebP files were compared byte-for-byte with Git HEAD and matched; the UTF-8 source document was reread successfully.
- All six original generated images and all six 640-pixel WebP previews were visually inspected. They show the intended subject without private records, text-based UI, visible brand marks, or watermarks. Small variants preserve the cover's key subject.

| Cover | Visual result |
| --- | --- |
| `roommate-housekeeper` | Warm apartment cutaway, blank calendar and abstract tokens remain legible. |
| `mistbound-letters` | Envelope, postal boat and lighthouse remain distinct. |
| `moonlit-immortal` | Mountain gate and rising moonlit path remain legible. |
| `yunque-sanguo` | Original cards, tiny armies and strategy board remain distinct. |
| `agent-journey` | Abstract staircase and node connections remain legible; no notes shown. |
| `ai-collaboration` | Human hand, mechanical helper and physical design modules remain distinct. |

## Exact generation prompts

Tool for every entry: built-in OpenAI ImageGen; opaque background; no image-reference inputs.

### roommate-housekeeper

Use case: stylized-concept. Asset type: original concept cover for a personal portfolio project about sharing a home and managing household tasks. Create one independent cinematic miniature 3D illustration, landscape 16:10, target 1536x960. A cozy shared apartment cutaway miniature at night: a small communal table with a few abstract blank expense tokens, a tiny blank calendar, a tidy mop and cleaning caddy, sofa, houseplants and warm lamps. Carefully modeled matte surfaces and delicate textures. Dark green-black background close to #0e1414, restrained lemon-yellow highlights, warm amber window light, calm atmospheric depth, premium editorial composition with a clear center. Keep all essential objects inside the central 80 percent. No text, numbers, account details, real bills, logos, watermark, people portraits or interface screenshot. This is original conceptual artwork, not actual app UI. One coherent scene only.

### mistbound-letters

Use case: stylized-concept. Asset type: original portfolio concept cover for a sea-island correspondence adventure. One independent cinematic miniature 3D illustration, landscape 16:10, target 1536x960. A small postal boat sailing a quiet dark teal sea among misty rocky islands at night, a warm illuminated lighthouse on a distant island, a carefully modeled cream envelope with an abstract wax seal resting on the foreground harbor pier, soft moon reflection and layered fog. Premium finely detailed stylized materials, restrained cinematic lighting, deep green-black #0e1414 surroundings with tiny lemon-yellow and warm amber highlights. The postal boat and envelope create one calm coherent scene. Central safe composition. No text, letters, numbers, logos, watermark, real game UI or screenshots. Original conceptual artwork.

### moonlit-immortal

Use case: stylized-concept. Asset type: original portfolio concept cover for an Eastern fantasy cultivation adventure. One independent cinematic miniature 3D illustration, landscape 16:10, target 1536x960. A winding stone stairway rising through moonlit eastern mountain peaks toward an elegant ancient Chinese mountain gate and small temple, stylized pine trees and a sea of mist, a luminous full moon overhead. One tiny anonymous cloaked traveler on the path for scale. Dark green-black #0e1414 shadows, moonlight silver and restrained lemon-yellow lantern glows, precise matte miniature stone and carved wood textures. Premium atmospheric editorial composition, calm mysterious mood, main architecture in central 80 percent. No readable text, symbols resembling account information, logos, watermark, user interface or actual game screenshot. One coherent original conceptual scene.

### yunque-sanguo

Use case: stylized-concept. Asset type: original portfolio concept cover for a Three Kingdoms-inspired fantasy card and strategy game. One independent cinematic miniature 3D illustration, landscape 16:10, target 1536x960. An intricately modeled dark jade strategy board on a dark green table; tiny original eastern-fantasy miniature soldiers and fortified gates, three elegant collectible cards standing at the back with original illustrated anonymous warrior silhouettes and ornate geometric borders. Cards show imagery only, no letters or numbers. Restrained lemon-yellow pennants, aged bronze armor details, matte stone tiles, premium miniature design, cinematic low-key lighting. Green-black #0e1414 surrounding darkness, warm gold focal lights, subtle mist. One coherent carefully arranged tabletop scene, central safe composition. Must not resemble an existing commercial game, no copyrighted game characters, logos, watermark, readable text, actual gameplay screenshot or UI.

### agent-journey

Use case: stylized-concept. Asset type: original portfolio concept cover for a private learning notebook about AI agents and software architecture. One independent cinematic miniature 3D illustration, landscape 16:10, target 1536x960. Abstract precisely modeled graphite-green architecture modules forming an ascending staircase through darkness, connected by delicate glowing lemon-yellow node lines. Each step contains a small simple abstract cube or sphere, the uppermost platform glows softly; a visual metaphor of learning and building technical systems. Sophisticated matte ceramic and brushed-metal details, dark green-black #0e1414 environment, restrained lemon-yellow light and subtle atmospheric depth, premium calm editorial composition. No documents, no private notes, no screens, no text, no letters, no numbers, no logos, no watermark, no real interface or technical claims. One coherent original concept scene.

### ai-collaboration

Use case: stylized-concept. Asset type: original portfolio concept cover about human and AI collaboration in design and engineering. One independent cinematic miniature 3D illustration, landscape 16:10, target 1536x960. A precise dark-green workshop tabletop with physical modular architectural blocks, a few translucent blank design canvases standing on small holders, drafting tools, a minimal jointed mechanical helper arm connecting two modules, delicate lemon-yellow paths linking the pieces. A tangible metaphor for translating an idea into working software, not any actual user interface. Finely crafted matte ceramic and dark brushed metal, background close to #0e1414, restrained lemon-yellow accents, subtle warm task lighting, atmospheric cinematic depth, sophisticated composed studio mood. Central safe composition. No readable text, numbers, private files, account details, product logos, trademarked robots, watermark, screenshot or real application UI. One coherent original concept scene.
