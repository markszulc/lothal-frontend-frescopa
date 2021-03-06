/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

'use strict';

const path                    = require('path');
const webpack                 = require('webpack');
const MiniCssExtractPlugin    = require("mini-css-extract-plugin");
const TSConfigPathsPlugin     = require('tsconfig-paths-webpack-plugin');
const TSLintPlugin            = require('tslint-webpack-plugin');
const CopyWebpackPlugin       = require('copy-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src';

module.exports = {
        resolve: {
            extensions: ['.js', '.ts'],
            plugins: [new TSConfigPathsPlugin({
                configFile: "./tsconfig.json"
            })]
        },
        entry: {
            site: SOURCE_ROOT + '/main.ts'
        },
        output: {
            filename: 'js/theme.js',
            path: path.resolve(__dirname, 'dist')
        },
        optimization: {
            splitChunks: {
                   chunks: 'all'
                 }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: [
                        /(node_modules)/
                    ],
                    use: [
                        {
                            loader: 'ts-loader'
                        },
                        {
                            loader: 'webpack-import-glob-loader',
                            options: {
                                url: false
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    include: /src/,
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            'autoprefixer',
                                        ],
                                    ],
                                }
                            }
                        },
                        "sass-loader",
                        "webpack-import-glob-loader"
                    ]
                },
                {
                    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                    type: 'asset/resource',
                    generator: {
                      filename: '[path][name].[ext]'
                    }
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.MAP_DATA_URL_AUTHOR': JSON.stringify(process.env.MAP_DATA_URL_AUTHOR),
                'process.env.MAP_DATA_URL_PUBLISH': JSON.stringify(process.env.MAP_DATA_URL_PUBLISH),
                'process.env.MAP_DATA_USER': JSON.stringify(process.env.MAP_DATA_USER),
                'process.env.MAP_DATA_PASSWORD': JSON.stringify(process.env.MAP_DATA_PASSWORD),
                'process.env.GOOGLE_MAP_KEY': JSON.stringify(process.env.GOOGLE_MAP_KEY),
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/theme.css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './resources' }
                ]
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ],
        stats: {
            assetsSort: "chunks",
            builtAt: true,
            children: false,
            chunkGroups: true,
            chunkOrigins: true,
            colors: false,
            errors: true,
            errorDetails: true,
            env: true,
            modules: false,
            performance: true,
            providedExports: false,
            source: false,
            warnings: true
        }
};
