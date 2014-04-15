/**
 * fis.baidu.com
 */

var nopt = require('nopt');
var path = require('path');

module.exports = function (options) {
    var scf_opts = {};

    var dist = options.dir;

    function module_fn() {
        if (!options.withPlugin) {
            scf_opts.exclude = /package\.json|\/plugin\/.*|page\/layout.tpl/i;
        }

        fis.scaffold.download('pc-scaffold-module', dist, scf_opts, function () {
            fis.scaffold.prompt(dist);
        });
    }

    function widget_fn() {
        fis.scaffold.download('pc-scaffold-widget', dist, {}, function () {
            var files = fis.util.find(dist);

            fis.util.map(files, function (index, filepath) {

                if (filepath) {
                    
                    var name = require('path').basename(dist);
                    
                    //replace rel path
                    var content = fis.util.read(filepath, {
                        encoding: 'utf8'
                    });

                    fis.util.write(filepath, content.replace(/widget\.(js|css|tpl)/g, function (match, ext) {
                        match = name + '.' + ext;
                        return match;
                    }));

                    var m = filepath.match(/widget\.(js|css|tpl)$/);
                    
                    if (m) {
                        fis.util.copy(filepath, dist + '/' + name + '.' + m[1]);
                        fis.util.del(filepath);
                    }
                }
            });

            fis.scaffold.prompt(dist);
        });
    }

    return {
        module: module_fn,
        widget: widget_fn
    }
};