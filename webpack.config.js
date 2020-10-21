
require('typescript-require')({
  nodeLib: true,
  targetES5: false
});
var webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { isProd, envs } = require('./scripts/envs.js');
//module.exports =
const config= {
  entry: {
    index: './index.ts',
    test: './test.ts',
   
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    // publicPath: './',
  },
  devServer:{
	port:5000,
	open:true,
	hot:true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  
  /*
  externals: {
    'lit-element': {
      commonjs: 'lit-element',
      commonjs2: 'lit-element',
      amd: 'lit-element'
    
    },
    'lit-html': {
      commonjs: 'lit-html',
      commonjs2: 'lit-html',
      amd: 'lit-html'
    },
  },*/
  
 // mode: isProd() ? envs.production : envs.development,
  devtool: 'source-map',

  plugins: [
    /*new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),*/
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'lit-element',
      template: 'index.html'
	  
    }),
    new webpack.HotModuleReplacementPlugin() 
  ],

  resolve: {
    extensions: ['.mjs', '.ts', '.js', '.scss', '.svg', '.css'],
	alias: {
    '@':__dirname
		//'lit-html/lib/shady-render.js': path.resolve(__dirname, './node_modules/lit-html/lit-html.js')
	}
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.svg$/,
        loader:'file-loader',
        options:{
          outputPath:'iconfont',
          name:'[name].[ext]'
        }
      },
      
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'components'),
         use: [{
          loader: 'lit-scss-loader',
          options: {
            minify: true,
          },
        }, 'extract-loader', 'css-loader', 'sass-loader'],
      },

      {
         test: /\.js?$/,
         exclude: /(node_modules|bower_components)/,
         include: /(\/node_modules\/lit-html)|(\/node_modules\/lit-element)/,
         use: [{
           loader:'babel-loader',
           options:{
             "presets": [
               ["@babel/preset-env", {
                   "targets": {
                       "browsers": ["> 1%", "last 2 versions"]
                   }
               }]
             ]
           }
         }]
       },
      {
        test: /\.ts?$/,
        use: [{
          loader: 'ts-loader',
        }],
        exclude: /(node_modules|bower_components)/

      }
    ]
  }
};

module.exports=config;