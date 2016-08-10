var through = require('through2'),
    gutil = require('gulp-util'),
    PoFile = require('pofile'),
    lodash = require('lodash'),
    path = require('path');

/**
 * Concatenates several .po file into one file per language.
 *
 * @param {Object} options List of additional options.
 *
 * @returns {Function} A function which can be piped to files stream.
 */
var concatPoModulesPlugin = function (options) {
    var options = options || {},
        combinedPo,
        firstFileForLanguage = true;
    var languageCatalog = {};

    return through.obj(function (file, enc, callback) {
        var stream = this;

        if (file.isNull()) {
            callback();

            return;
        }

        if (file.isStream()) {
            stream.emit('error', new gutil.PluginError('gulp-concat-po-modules', 'Streams are not supported'));
            callback();

            return;
        }

        var currentPo = PoFile.parse(file.contents.toString());
        firstFileForLanguage = languageCatalog[currentPo.headers.Language] === undefined;

        if (firstFileForLanguage) {
            // The current file is the first file.
            firstFileForLanguage = file;

            combinedPo = new PoFile();
            languageCatalog[currentPo.headers.Language] = combinedPo;
            // Use headers from the first file
            combinedPo.headers = lodash.merge(currentPo.headers, (options.headers || {}));
            // Array.prototype.concat([]) is used to clone the items array
            combinedPo.items = currentPo.items.concat([]);
        } else {
            combinedPo = languageCatalog[currentPo.headers.Language];
            // Merge files by merging their items
            for (var i = 0, l = currentPo.items.length; i < l; i++) {
                var currentItem = currentPo.items[i];

                // Check if the current item is already in the target po file.
                var sameItem = lodash.find(combinedPo.items, function (item) {
                    return (item.msgid === currentItem.msgid)
                        && (item.msgctxt === currentItem.msgctxt);
                });

                if (sameItem) {
                    // Merge items by merging their references
                    sameItem.references = lodash.unique(sameItem.references.concat(currentItem.references));
                } else {
                    // Add item to the resulting file
                    combinedPo.items.push(currentItem);
                }
            }
        }

        callback();
    }, function (callback) {
        for (var lang in languageCatalog) {
            var po = languageCatalog[lang];
            this.push(new gutil.File({
                path: path.join(process.cwd(), lang + '.po'),
                contents: new Buffer(po.toString())
            }));
        }

        callback();
    });
};

module.exports = concatPoModulesPlugin;
