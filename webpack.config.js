const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].[hash:8].bundle.js',
        chunkFilename: '[name].[hash:8].js'
    },

    devServer: {
    },

    devtool: 'inline-source-map', // 报错的时候在控制台输出哪一行报错

    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5, // 按需加载时候最大的并行请求数
            maxInitialRequests: 3, // 一个入口最大的并行请求数
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /node_modules\/.*\.js/,
                    priority: 10,
                    chunks: 'initial'
                }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.js/,
                use: "happyPack/loader?id=babel",
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.less/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ],
    }, 
    


    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            favicon: 'public/favicon.ico',
            template: 'public/index.html',
            hash: true
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: ['babel-loader']
        })
    ]
}