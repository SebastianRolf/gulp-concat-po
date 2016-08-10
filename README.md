# gulp-concat-po-modules

> Correctly concatenates .po files from several bower modules. Outputs one file per language found in all streamed files.
> Languages are read from the PO headers, not the filenames.

Based on [gulp-concat-po](https://github.com/JustBlackBird/gulp-concat-po) by Dmitriy Simushev


## Install

1. Install the plugin with the following command:

	```shell
	npm install gulp-concat-po-modules --save-dev
	```


## Usage

Simply concatenate files to the output directory:
```js
var gulp = require('gulp');
var concatPoModules = require('gulp-concat-po-modules');

gulp.task('translations', function () {
  return gulp.src(['app/bower_components/**/*.po', 'app/po/**/*.po'])
    .pipe(concatPoModules())
    .pipe(gulp.dest('app/i18n/'));
});
```


Pipe the result directly to other tools, e.g. gulp-angular-gettext:
```js
var gulp = require('gulp');
var concatPoModules = require('gulp-concat-po-modules');
var gettext = require('gulp-angular-gettext');

gulp.task('translations', function () {
  return gulp.src(['app/bower_components/**/*.po', 'app/po/**/*.po'])
    .pipe(concatPoModules())
    .pipe(gettext.compile({
      // options to pass to angular-gettext-tools...
      format: 'javascript',
      module: packageInfo.name
    }))
    .pipe(gulp.dest('app/i18n/'));
});
```


## API

### concatPo(options)

#### options.headers

Type: `Object`

A list of headers that will be used in the resulting .po file. The object can contain the following keys:

- Project-Id-Version
- Report-Msgid-Bugs-To
- POT-Creation-Date
- PO-Revision-Date
- Last-Translator
- Language
- Language-Team
- Content-Type
- Content-Transfer-Encoding
- Plural-Forms

Description of the fields can be found [here](https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html#Header-Entry).
If a field is not specified the value from the first file in the stream will be used.


## License

[MIT](http://opensource.org/licenses/MIT) © Sebastian Rolf
