"""
md_to_html.py: Convert EasyText markdown (with {{cX::}} cloze markers) to HTML.
Uses mistune for full Markdown support. Preserves {{cX::}} markers unchanged.

Usage:
  uv run --project ./src python .claude/skills/anki-card-formatter-html/md_to_html.py <input.md> [output.csv]
"""
import re
import csv
import sys
import os
import mistune


# Cloze marker pattern: {{c1::text}} or {{c1::text::hint}}
CLOZE_PATTERN = re.compile(r'\{\{c\d+::.*?\}\}')
# Placeholder prefix/suffix that won't appear in normal text
PLACEHOLDER_PREFIX = '§§CLOZE_'
PLACEHOLDER_SUFFIX = '§§'


def protect_cloze_markers(text):
    """Replace {{cX::}} markers with placeholders to protect from HTML conversion."""
    cloze_map = {}

    def replace_fn(match):
        key = f'{PLACEHOLDER_PREFIX}{len(cloze_map)}{PLACEHOLDER_SUFFIX}'
        cloze_map[key] = match.group(0)
        return key

    protected_text = CLOZE_PATTERN.sub(replace_fn, text)
    return protected_text, cloze_map


def restore_cloze_markers(text, cloze_map):
    """Restore {{cX::}} markers from placeholders."""
    for key, value in cloze_map.items():
        text = text.replace(key, value)
    return text


def split_into_sections(content):
    """Split content into sections based on # § headers."""
    lines = content.split('\n')
    sections = []
    current_lines = []
    in_section = False

    for line in lines:
        if re.match(r'^# §', line):
            if in_section and current_lines:
                sections.append(current_lines)
            current_lines = [line]
            in_section = True
        elif in_section:
            current_lines.append(line)

    if current_lines:
        sections.append(current_lines)

    return sections


def convert_section_to_html(lines):
    """Convert a section's markdown lines to HTML using mistune."""
    text = '\n'.join(lines)

    # Protect cloze markers from HTML conversion
    protected_text, cloze_map = protect_cloze_markers(text)

    # Use mistune for full Markdown conversion
    md = mistune.create_markdown(
        plugins=['strikethrough', 'footnotes', 'table', 'task_lists', 'url']
    )
    html = md(protected_text)

    # Restore cloze markers
    html = restore_cloze_markers(html, cloze_map)

    # # Clean up: remove wrapping <p> tags if the entire content is a single block
    # html = html.strip()

    return html


def process_file(filepath):
    """Process a single EasyText .md file into list of HTML section strings."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    sections = split_into_sections(content)
    html_sections = []

    for section_lines in sections:
        html = convert_section_to_html(section_lines)
        if html:
            html_sections.append(html)

    return html_sections


def main():
    if len(sys.argv) < 2:
        print("Usage: uv run --project ./src python .claude/skills/anki-card-formatter-html/md_to_html.py <input.md> [output.csv]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(input_file):
        print(f"ERROR: File not found: {input_file}")
        sys.exit(1)

    sections = process_file(input_file)
    print(f"Processed: {os.path.basename(input_file)} → {len(sections)} sections")

    if output_file:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f, quoting=csv.QUOTE_ALL, lineterminator='\n')
            for section in sections:
                writer.writerow([section])
        print(f"Output: {output_file}")
    else:
        for section in sections:
            print(section)
            print("---END_SECTION---")


if __name__ == "__main__":
    main()
