// Vite supplies its deployment base. Native ES modules also work when GitHub
// Pages publishes the source checkout directly, with assets inside public/.
export function publicAsset(path) {
  const base = import.meta.env?.BASE_URL ?? "./public/";
  return `${base}${path.replace(/^\/+/, "")}`;
}
