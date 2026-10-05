export function getHashId(link) {
  const url = link?.url ?? "";
  const hashIndex = url.indexOf("#");
  return hashIndex !== -1 ? url.slice(hashIndex + 1) : null;
}
