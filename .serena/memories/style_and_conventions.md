# Style and conventions
- Follow AGENTS.md. Serena is primary for TypeScript/TSX code inspection/editing.
- Frontend components should be small and componentized. Component files use PascalCase; non-components use kebab-case.
- Do not use React namespace imports; import hooks/types by name.
- No native alert/confirm/select. Use project helpers/components.
- No input type=number; use text inputs with inputMode, parsing, masks/placeholders, and debounced text input pattern.
- Backend DTOs should be TypeBox schemas with derived static types; use `response:` in Elysia route options, not `result:`.
- Never edit frontend/src/lib/api/generated directly; regenerate from backend OpenAPI and Kubb.
- Locale JSON files must stay synchronized when adding/removing/renaming i18n keys.
- TanStack route files use folder/index structure for multi-segment paths.