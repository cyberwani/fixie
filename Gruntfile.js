module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg   : grunt.file.readJSON('package.json'),

		sass : {
			front: {
				files: {
					'css/build/fixie.css' : 'css/sass/fixie.scss'
				}
			}
		},

		concat: {
			js: {
				files: {
					'js/fixie.js' : [ 'js/lib/*.js', 'js/src/*.js']
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
				tasks: ['concat']
			}

		}

	});


	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'concat']);

};