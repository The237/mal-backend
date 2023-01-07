const Joi = require("joi");

const customJoiJson = Joi.extend({
  type: "array",
  base: Joi.array(),
  coerce: {
    from: "string",
    method(value, helpers) {
      if (
        typeof value !== "string" ||
        (value[0] !== "[" && !/^\s*\[/.test(value))
      ) {
        return;
      }
      try {
        return { value: JSON.parse(value) };
      } catch (ignoreErr) {}
    },
  },
});

module.exports = customJoiJson;
