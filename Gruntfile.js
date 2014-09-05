module.exports = function (grunt) {

    // Configuration de Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        uncss: {
          dist: {
            src: ['src/index.html'],
            dest: 'build/css/turbodrive.css',
            options: {
              report: 'min' // optional: include to report savings
            }
          }
        },
        
        cssmin: {
          minify : {
            src: ['build/css/turbodrive.css'],
            dest: 'build/css/turbodrive.min.css'
          }
        },
        
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'src/js/app/main.js',
                    baseUrl: 'src/js/app/',
                    optimize: 'uglify',
                    dir: 'build/js/app/'
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('css-optimisation', ['uncss','cssmin']);
    grunt.registerTask('default', ['requirejs']);

}