const path = require("path");
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    bundle: "./frontend/js/index.js"
  },

  output: {
    path: path.resolve(__dirname, 'frontend/dist'),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },

  plugins: [
    new Uglify()
  ]
};
