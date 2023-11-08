module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        disableHostCheck: true,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8025/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': 'api'
                }
            }

        }
    },
}