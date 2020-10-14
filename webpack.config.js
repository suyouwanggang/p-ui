
require('typescript-require')({
  nodeLib: true,
  targetES5: false
});

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
    /*
    'tips': './components/tips/index',
    'icon': './components/icon/index',
    'img': './components/img/index',
    "loading": './components/loading/index',
    'checkbox': './components/checkbox/index',
    'radio': './components/radio/index',
    'button': './components/button/index',
    'text': './components/text/index',
    'rate': './components/rate/index',
    'input': './components/input/index',
    'slider': './components/slider/index',
    'switch': './components/switch/index',
    'tab': './components/tab/index',
    'tree': './components/tree/index',
    'pop': './components/pop/index',
    'color-panel': './components/color-panel/index',
    'color': './components/color/index',
    'select': './components/select/index',
    'dialog': './components/dialog/index',
    'message': './components/message/index',
    'date-picker': './components/date-picker/index',
    'layout': './components/layout/index',
    'panel': './components/panel/index',
    'fieldset': './components/fieldset/index',
    'acpanel': './components/accordionPanel/index',
    'step': './components/step',
    'scroll': './components/scroll/index',*/
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

      /* {
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
       },*/
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