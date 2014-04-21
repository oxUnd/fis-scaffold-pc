/**
 * fis.baidu.com
 */

var path = require('path');

module.exports = function (options) {
    var scf_opts = {};

    var dist = options.dir;

    function module_fn() {
        if (!options.withPlugin) {
            scf_opts.exclude = /package\.json|\/plugin\/.*|page\/layout.tpl|README.md/i;
        }

        fis.scaffold.download('pc-scaffold-module', dist, scf_opts, function (paths) {
            if (options.withPlugin) {
                fis.scaffold.mv(path.resolve(dist, 'pc-plugin'), path.resolve(dist, 'plugin'));
            } else {
                fis.util.del(path.resolve(dist, 'pc-plugin'));
            }
            fis.scaffold.mv(path.resolve(dist, 'pc-scaffold-module'), dist);
            fis.scaffold.prompt(dist);
        });
    }

    function widget_fn() {
        fis.scaffold.download('pc-scaffold-widget', dist, {}, function (paths) {
            fis.scaffold.mv(path.resolve(dist, 'pc-scaffold-widget'), dist);
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
                        fis.scaffold.mv(filepath, path.resolve(dist, name + '.' + m[1]));
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
