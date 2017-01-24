var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var isThere = require('is-there');
var kaomojify = require('kaomojify');

function KaomojifyWebpackPlugin(options) {
    this.options = _.extend({
        outputPath: './dist'
    }, options);
    if (!isThere(this.options.outputPath)) {
        throw new Error('outputPath: ' + this.options.outputPath + ' is not existed');
    }
}

module.exports = KaomojifyWebpackPlugin;
KaomojifyWebpackPlugin.prototype.apply = function(compiler) {
    var self = this;
    compiler.plugin('done', function(statsData) {
        var stats = statsData.toJson();
        if (!stats.errors.length) {
            fs.realpath(self.options.outputPath, function(err, resolvedPath) {
                if (err) throw err;
                _.forEach(stats.assets, function(asset, index) {
                    if (path.extname(asset.name) === '.js') {
                        var jsFilePath = resolvedPath + '/' + asset.name;
                        var jsFileData = fs.readFileSync(jsFilePath, 'utf8');
                        jsFileData = kaomojify(jsFileData);
                        fs.writeFileSync(jsFilePath, jsFileData);
                    }
                });
            });
        }
    });
}
