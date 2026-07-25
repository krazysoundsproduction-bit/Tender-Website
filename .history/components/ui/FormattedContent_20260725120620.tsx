"use client";

interface Section {
  header: string | null;
  bullets: string[];
}

function parseContent(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let current: Section = { header: null, bullets: [] };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // A header: line ends with ":" OR is fully uppercase (min 3 chars)
    const isHeader =
      line.endsWith(":") ||
      (line.length >= 3 && line === line.toUpperCase() && /[A-Z]/.test(line));

    if (isHeader) {
      if (current.header !== null || current.bullets.length > 0) {
        sections.push(current);
      }
      current = { header: line.replace(/:$/, ""), bullets: [] };
    } else {
      // Strip leading bullet chars if already present
      const clean = line.replace(/^[-•*]\s*/, "");
      current.bullets.push(clean);
    }
  }

  if (current.header !== null || current.bullets.length > 0) {
    sections.push(current);
  }

  return sections;
}

export default function FormattedContent({ text }: { text: string }) {
  if (!text?.trim()) return null;

  const sections = parseContent(text);

  // If no headers were detected at all, render as plain bullet list
  const hasAnyHeader = sections.some((s) => s.header !== null);
  if (!hasAnyHeader) {
    return (
      <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm leading-relaxed">
        {sections.flatMap((s) =>
          s.bullets.map((b, i) => <li key={i}>{b}</li>)
        )}
      </ul>
    );
  }

  return (
    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
      {sections.map((section, si) => (
        <div key={si}>
          {section.header && (
            <p className="font-bold text-gray-900 mb-1">{section.header}</p>
          )}
          {section.bullets.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {section.bullets.map((b, bi) => (
                <li key={bi}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
