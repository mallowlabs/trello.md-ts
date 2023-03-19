// eslint-disable-next-line no-undef
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  ignorePatterns: [
    "extension/js/*.js"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off"
  }
}
