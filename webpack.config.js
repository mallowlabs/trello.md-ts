/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  devtool: "cheap-module-source-map",
  entry: {
    "js/bg": path.join(__dirname, "src/bg/index.ts"),
    "options/options": path.join(__dirname, "src/options/index.ts"),
  },
  output: {
    path: path.join(__dirname, "extension/"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
