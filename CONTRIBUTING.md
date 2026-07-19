# Contributing to Umeboshi

Umeboshi is an AI-powered Anki card generator built on Claude Code's skill system.
Contributions are welcome — whether you're fixing a typo, adding a new transcription
backend, or improving card generation quality.

For an overview of the project's design philosophy, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
For the principles guiding all decisions, see [plans/PRINCIPLES.md](plans/PRINCIPLES.md)
(in Japanese, the developer's native language).

## Help Wanted

If you'd like to contribute but don't know where to start:

- **New backends**: Add support for a new LLM provider, transcription service, or Anki import method.
  See [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md) for the step-by-step guide.
- **Bug reports**: Found something broken? [Open an issue](https://github.com/Ark-Karim/umeboshi/issues).
- **Documentation**: Typos, unclear sections, missing translations (especially English → Japanese).

## Larger Changes

Before starting work on a large change, please [open an issue](https://github.com/Ark-Karim/umeboshi/issues)
first to discuss it. This prevents wasted effort if the change doesn't align with the project's direction.

## Consider a Plugin First

Before submitting a PR that changes the core pipeline (the main skills in `skills/`),
consider whether your idea could be implemented as a **plugin** instead.

Umeboshi uses a plugin system with 5 backend types:
- **transcribe** — audio → text
- **generate** — text → Anki cards
- **import** — cards → Anki
- **notetype** — card rendering
- **sync** — cloud sync (optional)

Plugins live in `plugins/<type>/<name>/SKILL.md` and are auto-discovered via
`plugins/registry.json`. A plugin is just one markdown file — no build step,
no framework. See [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md).

**Rule of thumb**: If your change adds a new service, provider, or format, it should be a plugin.
If it changes how existing backends work, it's a core change.

## Pull Request Description

When opening a pull request, please include:

- **What** the change does
- **Why** it's needed (link to an issue if applicable)
- **How to test** it (step-by-step instructions)
- **Screenshots** or output examples for visual changes (card rendering, docs, etc.)

## Linked Issues

PRs that fix bugs or add features should reference an existing issue.
If no issue exists, please open one first so we can confirm the problem or feature direction
before you invest time in coding.

## Code Style

### Skills (SKILL.md files)

- Use `## CoT` (Chain of Thought) as the main instruction section
- Be explicit about input/output file paths — use `<absolute path>` placeholders
- When referencing other skills, use their full path: `skills/<name>/SKILL.md`
- Keep skills short and focused. A skill should do one thing well.

### Plugins

- Follow the interface contract in `plugins/INTERFACE.md`
- Document prerequisites (API keys, installed tools) in the `Prerequisites` section
- Include cost estimates for external API usage
- Test with `plugins/registry.json` → change `active`, run the pipeline, verify output

## Do One Thing

Each PR should address one issue or feature. Split unrelated changes into separate PRs.
Small, focused PRs are easier to review and safer to merge.

## AI-Assisted Contributions

Umeboshi itself is built with Claude Code, and we welcome AI-assisted contributions.
However, you must **understand every change you submit**. If you cannot explain
what your changes do and how they interact with the pipeline, your PR will be closed.

Guidelines for AI-assisted PRs:
- Review all AI-generated code carefully before submitting
- Verify that referenced file paths actually exist
- Test the change end-to-end (clone → install → generate → import)
- Mark AI-generated PRs with an `ai-assisted` label

PRs that appear to have been submitted without human review — containing
references to files that don't exist, instructions that can't be followed,
or code that doesn't match the documented interfaces — may be closed without
further discussion.

## Testing

Before submitting, verify:

1. **Skills copy correctly**: Run `./install.sh` and confirm all skills appear in `~/.claude/skills/`
2. **Plugin discovery works**: Change `plugins/registry.json` → `active` for your plugin type, run the pipeline, verify the new plugin is invoked
3. **Secret scan passes**: The CI workflow (`gitleaks`) should pass on your PR

## License

By contributing, you agree that your code will be licensed under the
[GNU AGPL-3.0](LICENSE), the same license as the project. Please add yourself
to the [NOTICE](NOTICE) file if you'd like attribution.

## Community

- **Issues**: [github.com/Ark-Karim/umeboshi/issues](https://github.com/Ark-Karim/umeboshi/issues)
- **Discussions**: [github.com/Ark-Karim/umeboshi/discussions](https://github.com/Ark-Karim/umeboshi/discussions) (if enabled)
