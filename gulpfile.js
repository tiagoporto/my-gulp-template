/*
	My gulp.js template
	Version: 1.1.0
	Author: Tiago Porto - http://www.tiagoporto.com
	https://github.com/tiagoporto
	Contact: me@tiagoporto.com
*/

//************************* Load dependencies ****************************//

var		  gulp = require('gulp'),
		uglify = require('gulp-uglify'),
	  imagemin = require('gulp-imagemin'),
		svgmin = require('gulp-svgmin'),
		rename = require('gulp-rename'),
		 clean = require('gulp-clean'),
		concat = require('gulp-concat'),
		notify = require('gulp-notify'),
	   compass = require('gulp-compass'),
		  path = require('path'),
		 watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
			lr = require('tiny-lr'),
		server = lr();

//***************************** Path configs *****************************//

var			public_path = 'public/', // public files
   global_public_images = public_path + 'img', //root public images directory
   	 curent_path_images = '/', //atual image path
		  public_images = public_path + 'img' + curent_path_images, // optimized images
		  public_styles = public_path + 'css', // minified styles
		 public_scripts = public_path + 'js', // concat and minify scripts
			  sass_path = 'src/stylesheets/', // sass files
				js_path = 'src/scripts/', // js files
	  global_image_path = 'src/images/', //root original images directory
			  img_path  = global_image_path + curent_path_images, // original image files
			sprite_path = global_image_path + 'sprite-icons.png'; // sprite filename


//******************************** Tasks *********************************//

// Optimize Images
gulp.task('images', function() {
	gulp.src([img_path + '**/*.{png,jpg,gif}', '!' + img_path + '/icons/*', '!' + sprite_path])
		.pipe(imagemin({optimizationLevel: 5, progressive: true, cache: true}))
		.pipe(gulp.dest(public_images))
		.pipe(livereload(server))
		.pipe(notify({message: 'Images task complete'}));
});

// Optimize Sprite
gulp.task('sprite', function() {
	gulp.src(sprite_path)
		.pipe(imagemin({optimizationLevel: 3, progressive: true, cache: true}))
		.pipe(gulp.dest(global_public_images))
		.pipe(livereload(server))
		.pipe(notify({message: 'Sprite task complete'}));
});

//Otimize svg Images
gulp.task('svgImagens', function() {
	gulp.src(img_path + '**/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest(public_images))
		.pipe(livereload(server))
		.pipe(notify({message: 'SVG task complete'}));
});

// Concat and Minify Scripts
gulp.task('scripts', function() {
	gulp.src([js_path + '/libs/**',
		      js_path + 'frameworks/**',
		      js_path + 'plugins/**',
		      js_path + 'onread/open_onread.js',
		      js_path + '/**/*.js',
		      js_path + 'onread/close_onread.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(public_scripts))
		.pipe(rename('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(public_scripts))
		.pipe(livereload(server))
		.pipe(notify({message: 'Scripts task complete'}));
});

// Compile Compass
gulp.task('compass', function() {
	gulp.src(sass_path + '**/*.{sass,scss}')
		.pipe(compass({
			project: path.join(__dirname, '/'),
			css: public_styles,
			sass: sass_path,
			image: global_image_path,
			style: 'nested', //The output style for the compiled css. Nested, expanded, compact, or compressed.
			comments: false,
			relative: false,
		}))
		.pipe(livereload(server))
		.pipe(notify({message: 'Compass task complete'}));
});

// Clean Directories
gulp.task('clean', function() {
	return gulp.src([public_styles,
					 public_scripts,
					 public_images], {read: false})
		.pipe(clean())
		.pipe(notify({message: 'Clean task complete'}));
});

// Reload Browser
gulp.task('reload-browser', function() {
	gulp.src(public_path + '**/*.{html,php}')
		.pipe(livereload(server))
		.pipe(notify({message: 'Reload complete'}));
});

// Watch
gulp.task('watch', function() {
	//Listen on port 35729
	server.listen(35729, function (err) {
		if (err) return console.log(err);

		// Watch .js files
		gulp.watch(js_path + '**/*.js', function(event) {
			gulp.run('scripts');
		});

		// Watch sass files
		gulp.watch(sass_path + '**/*.{sass,scss}', function(event) {
			gulp.run('compass');
		});

		// Watch .jpg .png .gif files
		gulp.watch([img_path + '**/*.{png,jpg,gif}', '!' + sprite_path], function(event) {
		  gulp.run('images');
		});

		// Watch sprite file
		gulp.watch(sprite_path, function(event) {
		  gulp.run('sprite');
		});

		// Watch .svg files
		gulp.watch(img_path + '**/*.svg', function(event) {
		  gulp.run('svgImagens');
		});

		//Watch .html .php Files
		gulp.watch(public_path + '**/*.{html,php}', function(){
			gulp.run('reload-browser');
		});

	});
});

// Default task
gulp.task('default', ['clean', 'compass', 'scripts', 'images', 'sprite', 'svgImagens'], function() {
	gulp.run('watch');
});