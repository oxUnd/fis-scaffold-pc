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
            fis.scaffold.prompt(dist);
        });
    }

    return {
        module: module_fn,
        widget: widget_fn
    }
};