export const mixClass = (...args) => args.filter((c) => !!c).join(" ");

export const isHTML = (str) => /<[^>]+>/gi.test(str);

export const isBoolean = (obj) =>
  Object.prototype.toString.call(obj) === "[object Boolean]";

export const isString = (obj) =>
  Object.prototype.toString.call(obj) === "[object String]";

export const isArray = (obj) =>
  Object.prototype.toString.call(obj) === "[object Array]";

export const isObject = (obj) =>
  Object.prototype.toString.call(obj) === "[object Object]";

export const isEmpty = (obj) => obj.length === 0;

export const isNone = (obj) => Object.keys(obj).length === 0;
