module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg   : grunt.file.readJSON('package.json'),

		sass : {
			front: {
				options: {
					style: 'expanded',
					debugInfo: true,
					lineNumbers: true
				},

				files: {
					'css/build/fixie.css' : 'css/sass/fixie.scss'
				}
			},

			uglify: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/build/fixie.min.css' : 'css/sass/fixie.scss'
				}
			}

		},

		concat: {
			js: {
				files: {
					'js/build/fixie.js' : [ 'js/lib/*.js', 'js/src/*.js']
				}
			}
		},

		uglify: {
			js: {
				files: {
					'js/build/fixie.min.js' : 'js/build/fixie.js'
				}
			}
		},

		watch: {

			sass: {
				files: ['css/sass/**/*.scss'],
				tasks: ['sass']
			},

			js: {
				files: ['js/lib/*.js', 'js/src/*.js'],
				tasks: ['concat', 'uglify']
			}

		}

	});


	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'concat', 'uglify']);

};