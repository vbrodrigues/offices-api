// MySQL compares names case-insensitively (utf8mb4_unicode_ci), so do the same
export function nameKey(name: string): string {
  return name.trim().toLocaleLowerCase();
}

// Returns `name`, or `name (1).ext`, `name (2).ext`... when it is already in
// `taken` (a set of nameKey()s). The returned name is added to `taken`.
export function uniqueName(name: string, taken: Set<string>): string {
  const dot = name.lastIndexOf('.');
  // A leading dot (".env") is part of the name, not an extension
  const hasExtension = dot > 0;
  const base = hasExtension ? name.slice(0, dot) : name;
  const extension = hasExtension ? name.slice(dot) : '';

  let candidate = name;
  for (let copy = 1; taken.has(nameKey(candidate)); copy++) {
    candidate = `${base} (${copy})${extension}`;
  }

  taken.add(nameKey(candidate));
  return candidate;
}
