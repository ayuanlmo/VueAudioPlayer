const path = require('path');
module.exports = {
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'sass',
            patterns: [
                path.resolve(__dirname, './src/assets/css/*.scss') //.scss文件所在目录
            ]
        }
    }
}