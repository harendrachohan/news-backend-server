function slugify(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120);

  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
}

module.exports = { slugify };
