// Compile and Prefix Sass
module.exports = function (gulp, plugins, paths, headerProject, autoprefixerBrowsers) {
    return function () {
		return  plugins.sass(paths.styles.src + 'styles.scss', {precision: 3, style: 'expanded'})
					.pipe(plugins.autoprefixer({
						browsers: autoprefixerBrowsers
					}))
					.pipe(plugins.wrapper({
						header: headerProject
					}))
					.on('error', function (err) {
						console.error('Error', err.message);
					})
					.pipe(plugins.csslint('./.csslintrc'))
					.pipe(plugins.csslint.reporter())
					.pipe(gulp.dest(paths.styles.dest))
					.pipe(plugins.csso())
					.pipe(plugins.rename({suffix: '.min'}))
					.pipe(gulp.dest(paths.styles.dest))
					.pipe(plugins.notify({message: 'Styles task complete', onLast: true}));
	};
};