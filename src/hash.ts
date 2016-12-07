// from http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
export function hashCode(str: string): number {
  var hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
