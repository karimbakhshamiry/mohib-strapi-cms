export function slugify(input: string) {
  return input
    .toString() // Ensure string
    .normalize("NFKD") // Normalize accented chars
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric except space
    .trim() // Trim whitespace
    .replace(/[_\s]+/g, "-") // Replace space/underscore with dash
    .toLowerCase(); // Convert to lowercase
}
