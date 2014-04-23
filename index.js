/**
 * fis.baidu.com
 */

var path = require('path');

module.exports = function (options) {
    var scf_opts = {};

    var dist = options.dir;

    function replace_delimiter_(string) {
        //if default, not replace
        if (options.ld == '{%')  {
            return string;
        }
        return string.replace(
            new RegExp('\\{%|%\\}', 'g'),
            function (m) {
                if (m == '{%') m = options.ld;
                else if (m == '%}') m = options.rd;
                return m;
            });
    }

    function module_fn() {
        if (!options.withPlugin) {
            scf_opts.exclude = /package\.json|\/plugin\/.*|page\/layout.tpl|README.md/i;
            scf_opts.deps = false; //don't download  `pc-plugin`
        }

        fis.scaffold.download('pc-scaffold-module', dist, scf_opts, function (paths) {
            if (options.withPlugin) {
                fis.scaffold.mv(path.resolve(dist, 'pc-plugin'), path.resolve(dist, 'plugin'));
            }
            fis.scaffold.mv(path.resolve(dist, 'pc-scaffold-module'), dist);
            fis.scaffold.prompt(dist, function () {
                var files = fis.util.find(dist, /.*\.tpl$/i);
                files.forEach(function (filepath) {
                    fis.util.write(filepath, replace_delimiter_(fis.util.read(filepath, {encoding: 'utf-8'})));
                });
            });
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

                    fis.util.write(
                        filepath, 
                        replace_delimiter_(
                            content
                                .replace(/widget\.(js|css|tpl)/g, function (match, ext) {
                                    match = name + '.' + ext;
                                    return match;
                                })
                        )
                    );

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

module.exports.command = function (commander) {
    //add option
    //add command
    
    var pragram = path.basename(process.argv[1]);
    var command = commander._name;

    commander
        .option('--ld <left_delimiter>', 'smarty left_delimiter', String, '{%')
        .option('--rd <right_delimiter>', 'smarty right_delimiter', String, '%}');

    commander.on('--help', function () {
        var egs = [
            'module -d ./to/directory/other',
            'module -d ./to/directory/common --with-plugin',
            'module -d ./to/directory/other --ld \'<%\' --rd \'%>\'',
            'widget -d ./widget/box',
            'modjs //download \'modjs\''
        ];
        var sp = '\n    ' + '$ ' + pragram + ' ' + command + ' ' ;
        console.log('  Examples:');
        console.log(sp + egs.join(sp));
    });
}
