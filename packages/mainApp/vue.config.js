const GeneraterAssetPlugin = require('generate-asset-webpack-plugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const {
    name
} = require('./package.json');
const timestamp = new Date().getTime();
const version = `v${timestamp}`;

const createJson = function () {

    const data = {
        app: {
            name,
            version
        }
    };

    return JSON.stringify(data);
};

const plugins = [

    // 生成版本标识
    new GeneraterAssetPlugin({
        filename: 'app.json',
        fn: (compilation, cb) => {

            cb(null, createJson());
        }
    }),

    // new MiniCssExtractPlugin({
    //     // 类似 webpackOptions.output里面的配置 可以忽略
    //     filename: '[name].css',
    //     chunkFilename: '[id].css',
    // }),

    // //  启用 gzip压缩
    // new CompressionPlugin({
    //     test: /\.js$|\.html$|.\css/, //匹配文件名
    //     threshold: 10240, //对超过10k的数据压缩
    //     deleteOriginalAssets: false //不删除源文件
    // })
];

module.exports = {
    // 是否为 Babel 或 TypeScript 使用 thread-loader。
    // 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建
    // parallel: true,
    // publicPath: process.env.VUE_APP_DEPLOY_URL,
    // filenameHashing: false,
    filenameHashing: true,
    productionSourceMap: false,
    css: {
        extract: true,
        sourceMap: false,
        requireModuleExtension: true,
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#00cd96',
                        'link-color': '#00cd96',
                        'border-radius-base': '4px',
                    },
                    javascriptEnabled: true,
                },
            },
        }
    },

    configureWebpack: {
        resolve: {
            extensions: [".js", ".vue", ".json", ".ts", ".tsx"]
        },
        module: {
            rules: []
        },
        plugins: [
            ...plugins
        ],
        externals: {
            // 'vue': 'Vue',
            // 'vue-router': 'VueRouter',
            // 'axios': 'axios'
        },
        // 开启分离js
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 20000,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `appbase.${packageName.replace('@', '')}`
                        }
                    }
                }
            }
        },
        // 取消webpack警告的性能提示
        performance: {
            hints: 'warning',
            // 入口起点的最大体积
            maxEntrypointSize: 50000000,
            // 生成文件的最大体积
            maxAssetSize: 30000000,
            // 只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {

                return assetFilename.endsWith('.js');
            }
        }
    },
    chainWebpack: (config) => {

        // 移除prefetch插件，避免加载多余的资源
        config.plugins.delete('prefetch');

        // 移除 preload 插件，避免加载多余的资源
        config.plugins.delete('preload');

        // 移除pwa
        config.plugins.delete('pwa');
        config.plugins.delete('workbox');

        config
            .plugin('html')
            .tap(args => {
                args[0].name = name;
                args[0].title = 'AppBase';
                args[0].version = timestamp;
                return args
            });


        // 包分析工具
        if (process.env.VUE_APP_NODE_ENV == 'analyzer') {

            config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
        }

        // // 开启GZip
        // config.plugin('compressionPlugin')
        //     .use(new CompressionPlugin({
        //         test: /\.js$|\.html$|\.css/, // 匹配文件名
        //         threshold: 10240, // 对超过10k的数据压缩
        //         deleteOriginalAssets: false // 不删除源文件
        //     }))
    },
    devServer: {
        hot: true,
        disableHostCheck: true,
        port: 8080,
        overlay: {
            warnings: false,
            errors: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
}