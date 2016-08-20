var path = require("path");
var appPaths = require("./root.js").paths;
var HtmlWebpackPlugin = require ("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

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
      { test: /\.css$/, exclude: /\.useable\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.less$/, exclude: /\.useable\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') },
      { test: /\.json/, loader: 'json-loader' }
    ]
  },
  resolveLoader: {
    modulesDirectories: [path.join(appPaths.rootDir, "node_modules")]
  },
  resolve: {
    extensions: [ "", ".js" ],
    modulesDirectories: ["node_modules"],
    alias: {
      app: path.join(appPaths.appSrcDir),
      node_modules: path.join(appPaths.modulesDirectory)
    }
  },
  plugins: [

    new webpack.ProvidePlugin({
        THREE: "three",
        TWEEN: "tween.js",
    }),
    
    new HtmlWebpackPlugin({
      chunks: ['app', 'devServer'],
      template: path.join(appPaths.appDir, "example.template.html"),
      filename: 'index.html'
    }),

    new ExtractTextPlugin('[name].bundle.css', {
      allChunks: true
    })
  
  ]
};
