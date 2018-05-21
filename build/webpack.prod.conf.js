const baseWebpackConfig = require('./webpack.base.conf');

var conf = baseWebpackConfig;
conf.mode = 'development'; // cuz production wont work

module.exports = baseWebpackConfig;