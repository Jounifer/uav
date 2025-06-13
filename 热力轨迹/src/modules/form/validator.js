import { isArray, isNone, isObject } from "../utils";

function _check({ pattern, validator, message }, value) {
  if (pattern) {
    if (!pattern.test(value)) {
      return message || "not pass";
    }

    return "";
  } else if (validator) {
    if (!validator(value)) {
      return message || "not pass";
    }

    return "";
  }

  return "";
}

function check(rule, value) {
  if (isObject(rule) || isArray(rule)) {
    if (isObject(rule)) {
      return _check(rule, value);
    }

    for (let i = 0, len = rule.length; i < len; i++) {
      const msg = _check(rule[i], value);
      if (!!msg) {
        return msg;
      }
    }
  } else {
    console.warn("the rule of Form should Object or Array");
  }

  return "";
}

function checkModel(model, rules, state) {
  return new Promise((resolve) => {
    if (isObject(model) && isObject(rules)) {
      const valid = [];
      if (!isNone(model) && !isNone(rules)) {
        const keys = Object.keys(rules);
        for (let i = 0, len = keys.length; i < len; i++) {
          const key = keys[i];
          const rule = rules[key];
          const text = check(rule, model[key]);
          state.set({ prop: key, text });
          valid.push(text);
        }

        resolve(!valid.join(""));
      }
    } else {
      console.warn("the model and rules of Form should be an Object");
    }
  });
}

export { checkModel, check };
