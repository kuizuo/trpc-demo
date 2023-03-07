/** @type {import("prettier").Config} */
const config = {
  plugins: [
    "prettier-plugin-organize-imports",
    require.resolve("prettier-plugin-tailwindcss")
  ],
};

module.exports = config;
