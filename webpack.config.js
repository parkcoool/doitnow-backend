const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "app.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  target: "node",
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: path.resolve(__dirname, "src"),
      }),
    ],
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
