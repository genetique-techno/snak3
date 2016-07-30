var path = require("path");
var appPaths = require("./root.js").paths;
var HtmlWebpackPlugin = require ("html-webpack-plugin");

module.exports = {
  devServer: {
    inline: true
  },
  entry: {
    app: ["babel-polyfill", path.resolve(appPaths.rootDir, "app", "index.js") ]
  },
  output: {
    path: "build",
    filename: "app.bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  resolveLoader: {
    modulesDirectories: [path.join(appPaths.rootDir, "node_modules")]
  },
  resolve: {
    extensions: [ "", ".js" ],
    modulesDirectories: ["node_modules"],
    alias: {
      app: path.join(appPaths.appSrcDir)
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['app', 'devServer'],
      template: path.join(appPaths.appDir, "example.template.html"),
      filename: 'index.html'
    })
  ]
};
