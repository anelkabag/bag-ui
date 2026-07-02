const isRegexLikeMatch = /[*+\\(|{^$]/;
const isRegexLike = (value) => isRegexLikeMatch.test(value);
export const toRegexOrString = (value) => typeof value === 'string' && isRegexLike(value) ? new RegExp(value) : value;
export const findMatch = (haystack, needle) => haystack.find(n => (typeof n === 'string' ? n === needle : n.test(needle)));
const idCharMatch = /[a-zA-Z0-9$_]/;
export const isIdChar = (text) => idCharMatch.test(text);
