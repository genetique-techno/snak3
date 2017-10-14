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
    path: path.resolve(__dirname, "build"),
    filename: "app.bundle.js"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader",
        }, {
          loader: "css-loader",
        }],
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader",
        }, {
          loader: "css-loader",
        }, {
          loader: "less-loader",
        }],
      },
      { test: /\.json/, loader: 'json-loader' },
      {
        test: /EffectComposer\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /RenderPass\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /CopyShader\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /ConvolutionShader\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /BloomPass\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /ShaderPass\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /TexturePass\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
      {
        test: /RGBShiftShader\.js/,
        loader: "expose-loader?THREE!imports-loader?this=>global!exports-loader?THREE",
      },
    ]
  },
  resolveLoader: {
    modules: ["node_modules"],
    extensions: [".js"],
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      app: path.join(appPaths.appSrcDir),
    }
  },
  plugins: [
    // makes THREE available in the global scope anywhere in the app
    new webpack.ProvidePlugin({
      THREE: "three"
    }),

    // makes TWEEN available in the global scope anywhere in the app
    new webpack.ProvidePlugin({
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
