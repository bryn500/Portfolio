'use strict'

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        // layout
        layout: './src/js/layout.js',
        // vue app
        'vue-app': './src/vue-app.js',
        // scss
        styles: './src/scss/styles.scss',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'js/[name].min.js',
        chunkFilename: 'chunk/[name].min.js',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            /*
             *   Non Vue rules
             */
            {
                // for .scss files in scss folder
                // converts scss files to css
                // resolves imports and urls
                // uses ExtractTextPlugin to create seperate scss file
                // fallback to adding CSS to the DOM by injecting a <style> tag
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "./src/scss/")
                ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../'
                        }
                    },
                    "css-loader",
                    'sass-loader'
                ]
            },
            /*
            *   Vue.js rules (single file components)
            */
            {
                // for css files not in scss folder
                // resolves imports and urls
                // adds CSS to the DOM by injecting a <style> tag for vue.js
                test: /\.css$/,
                exclude: [
                    path.resolve(__dirname, "./src/scss/")
                ],
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            // for scss files not in scss folder
            // converts scss files to css
            // resolves imports and urls
            // adds CSS to the DOM by injecting a <style> tag for vue.js
            {
                test: /\.scss$/,
                exclude: [
                    path.resolve(__dirname, "./src/scss/")
                ],
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            // for vue files not in js folder
            // complies single file vue components
            {
                test: /\.vue$/,
                exclude: [
                    path.resolve(__dirname, "./src/js/")
                ],
                loader: 'vue-loader'
            },
            // for js files not in js folder or node modules
            // uses babel to transpile
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, "./src/js/"),
                    /node_modules/
                ],
                loader: 'babel-loader',
            },
            // for image files
            // loads file with a hash in the filename to allow cache busting
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        // alias vue/dist/vue.esm.js to just vue so it's easier to reference
        alias: {
            //'vue$': 'vue/dist/vue.esm.js' // runtime only
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        hints: "warning"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        // extract scss to build folder taking name from entry list
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
        //,new BundleAnalyzerPlugin()
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}