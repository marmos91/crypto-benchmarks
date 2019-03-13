import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const configuration: webpack.Configuration = {
    entry: './src/index.ts',
    mode: 'development',
    target: 'web',
    node: {
        fs: 'empty'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.(ts)?$/,
            loader: 'ts-loader',
        },
        {
            test: /\.js$/,
            loader: 'source-map-loader',
            enforce: 'pre'
        }]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'index_bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
};

export default configuration;
