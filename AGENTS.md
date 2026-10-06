# Homepage deployment scope

- Repository: Adversit/dingkangopen. Production branch: main once ESA Git integration is connected and verified.
- Work only on user-requested homepage changes. A request to connect automatic deployment is not ongoing permission for unsolicited content changes or releases.
- Treat pushes to main as production releases after integration. Test the exact content first; inspect diffs and preserve unrelated work. Never force push.
- Public runtime files live in public/. Only public-files.json entries may reach dist/. Never copy the surrounding workspace, private notes, task records, original PNG sources, ZIP backups, credentials, or local Library receipts into this repository.
- Run npm run build before pushing. It runs the same dependency and logic checks used by ESA. Review actual browser behavior for UI changes when supported tools are available; report any blocked checks honestly.
- Use Node 22. This project has zero third-party dependencies; do not install tools or introduce GitHub Actions, AccessKeys, tokens, billing, or new persistent authorizations without need and proper authorization.
- Before publishing, confirm repository and branch, current remote HEAD, and the user's requested change. Do not overwrite a newer remote commit.
- After deployment, verify the exact remote commit against ESA's build record and the public deployment.json marker, then verify the served content. A successful GitHub push alone is not a successful ESA deployment.
- Do not change DNS or domain bindings incidentally. Keep the original ESA application and rollback path until a separately reviewed migration is verified.
