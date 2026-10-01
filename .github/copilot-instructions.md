# Footprint

Footprint is a VS Code-only extension from Waka Apps.

## Product promise

Every VS Code workspace gets a stable, attractive colour automatically so the user can identify windows at a glance.

## UX

The Status Bar is the only strong visual treatment.

Do not use:
- `window.activeBorder`
- Do not modify workspace files or repository settings.
- `window.inactiveBorder`
- DOM hacks

The Status Bar should show only:

`layout-panel` icon.

Clicking it opens exactly:
- ✓ Automatic
- Custom…

The check indicates the active mode.

Automatic removes the custom override.

Custom opens the current colour for editing when a custom colour exists.

Do not add About, Reset, Show Color, or other menu actions.

## Colors

- Stable workspace identity from normalized workspace location.
- SHA-256 seeded deterministic candidates.
- OKLCH/perceptual generation.
- Curated, Edge-inspired visual language without copying Edge branding.
- Avoid muddy colours.
- Separate simultaneously assigned workspaces perceptually.

## Theme

Only manage:
- `statusBar.background`
- `statusBar.foreground`
- `statusBarItem.hoverBackground`
- `statusBar.debuggingBackground`
- `statusBar.debuggingForeground`

Do not manage window borders.

Preserve unrelated `workbench.colorCustomizations`.

## Release

Keep `package.json` Marketplace-ready:
- lowercase unique `name`
- publisher ID
- PNG icon at least 128x128
- gallery banner
- README
- CHANGELOG
- LICENSE
- SUPPORT
- `.vscodeignore`


## Stability requirement

Automatic workspace colour selection must never depend on which other workspaces are currently open. Opening, closing, or reordering another workspace must not change an existing workspace colour. The Footprint v1 algorithm version is part of the hash input so future algorithm changes can be introduced deliberately.
