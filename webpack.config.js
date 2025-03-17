const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            'chatbot-widget': './src/js/chatbot.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].min.js' : '[name].js',
            library: 'ChatbotWidget',
            libraryTarget: 'umd',
            libraryExport: 'default',
            umdNamedDefine: true,
            publicPath: '',
            globalObject: 'this',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                // We don't need SVG rule anymore since we're using inline SVGs
                {
                    test: /\.(png|jpg|gif)$/,
                    type: 'asset/inline'
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isProduction ? '[name].min.css' : '[name].css',
            })
        ],
        optimization: {
            minimize: isProduction,
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};
