"use client";

type Block =
  | { type: "header"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] };

function isBulletLine(line: string): boolean {
  return /^[-•*]\s+/.test(line) || /^\d+\.\s+/.test(line);
}

function isHeaderLine(line: string): boolean {
  // Short line, no trailing period, not a bullet
  return (
    line.length > 0 &&
    line.length <= 60 &&
    !line.endsWith(".") &&
    !line.endsWith(",") &&
    !isBulletLine(line)
  );
}

function stripBulletChar(line: string): string {
  return line.replace(/^[-•*]\s+/, "").replace(/^\d+\.\s+/, "");
}

function parseContent(text: string): Block[] {
  const rawLines = text.split("\n");
  const blocks: Block[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Bullet line — collect consecutive bullets into one block
    if (isBulletLine(line)) {
      const items: string[] = [];
      while (i < rawLines.length && (isBulletLine(rawLines[i].trim()) || (rawLines[i].trim() === "" && i + 1 < rawLines.length && isBulletLine(rawLines[i + 1].trim())))) {
        const l = rawLines[i].trim();
        if (l) items.push(stripBulletChar(l));
        i++;
      }
      if (items.length) blocks.push({ type: "bullets", items });
      continue;
    }

    // Check if this looks like a header:
    // — short, no trailing period, and the NEXT non-empty line is longer (body text)
    const nextNonEmpty = rawLines.slice(i + 1).find((l) => l.trim())?.trim() ?? "";
    if (isHeaderLine(line) && (nextNonEmpty.length > line.length || nextNonEmpty === "")) {
      blocks.push({ type: "header", text: line.replace(/:$/, "") });
      i++;
      continue;
    }

    // Otherwise it's a paragraph — collect lines until blank line or header/bullet
    let para = line;
    i++;
    while (i < rawLines.length) {
      const next = rawLines[i].trim();
      if (!next) { i++; break; }
      if (isBulletLine(next)) break;
      // Stop if next line looks like a header
      const afterNext = rawLines.slice(i + 1).find((l) => l.trim())?.trim() ?? "";
      if (isHeaderLine(next) && (afterNext.length > next.length || afterNext === "")) break;
      para += " " + next;
      i++;
    }
    blocks.push({ type: "paragraph", text: para });
  }

  return blocks;
}

export default function FormattedContent({ text }: { text: string }) {
  if (!text?.trim()) return null;

  const blocks = parseContent(text);

  return (
    <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "header") {
          return (
            <p key={i} className="font-bold text-gray-900 mt-4 first:mt-0">
              {block.text}
            </p>
          );
        }
        if (block.type === "bullets") {
          return (
            <ul key={i} className="list-disc list-outside ml-5 space-y-1">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        // paragraph
        return (
          <p key={i} className="text-gray-700">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

