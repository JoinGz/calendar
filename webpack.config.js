const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // entry: ['babel-polyfill','./src/index.js'], //入口文件
  entry: './src/index.js', //入口文件
  output: {
    filename: 'my.js', //输出文件名
    path: path.resolve(__dirname, 'dist') //输出路径
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: __dirname + '/node_modules/', //排除这个文件，加快速度
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('postcss-import'), require('autoprefixer')]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('postcss-import'), require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|gif|jpg|svg|jpeg)$/i,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: 'img/[hash:5].[ext]'
            }
          }
          // {
          //   loader: 'image-webpack-loader', //新增image-webpack-loader
          //   options: {
          //     mozjpeg: {
          //       //设置对jpg格式的图片压缩的程度设置
          //       progressive: true,
          //       quality: 65
          //     },
          //     optipng: {
          //       progressive: true,
          //       quality: 65
          //     }
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: 9000,
    open: true,
    index: 'index.html',
    inline: true
  }
}
