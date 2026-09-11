# project-01 working agreement

This repository contains Paperbound, not the separate little-knight-adventure game.

The user requested source preservation in KieKoongDev/project-01 and automatic testing updates on Railway. For future user-requested game changes, use the testing branch, run `pnpm check`, and commit/push the validated changes so the Railway service can deploy once its GitHub App installation is authorized. At handoff Railway reported NO_INSTALLATION; never claim auto-deploy is active until verified. Do not force-push or overwrite unrelated remote changes. Do not merge testing into main unless requested.

Keep the game word/point-first until the concept is validated. Preserve the flat papercraft card art contract in docs/ART-DIRECTION.md. Prefer data-driven era/knowledge/event rules. Keep collection rendering bounded for 1,000+ items. Tests should target rule invariants and concrete risks.

Store secrets only in Railway Variables. Commit .env.example, never actual .env files, tokens, credentials, caches, or generated build output. Runtime configuration must use Railway's PORT and bind 0.0.0.0.

Do not claim multiplayer, offline PWA, live AI, scientific recipe accuracy or verified 60fps unless implemented and measured. Keep changelog and version visible when publishing a meaningful testing patch.
