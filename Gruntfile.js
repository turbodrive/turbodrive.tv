module.exports = function (grunt) {

    // Configuration de Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        copy: {
          main: {
            files: [
              {expand: true, cwd: 'src/', src: [
                  '*.html',
                  'js/**/*.*',
                  '!js/app/**/*.*',
                  'php/*',
                  'css/**/*.*',
                  '!css/turbodrive.css',
                  'images/**/*.*'
              ],
               dest: 'build/'},
            ]
          }
        },
        
        uncss: {
          dist: {
            src: ['src/index.html'],
            dest: 'build/css/turbodrive.un.css',
            options: {
              report: 'min' // optional: include to report savings
            }
          }
        },
        
        cssmin: {
          minify : {
            src: ['build/css/turbodrive.un.css'],
            dest: 'build/css/turbodrive.css'
          }
        },
        
        /*requirejs: {
            compile: {
                options: {
                    logLevel:0,
                    mainConfigFile: 'src/js/app/main.js',
                    baseUrl: 'src/js/app/',
                    optimize: 'uglify',
                    uglify: {
                        options: {
                          compress: {
                            drop_toto: true,
                            drop_debugger: true,
                            global_defs: {
                                "DEBUG":false
                            },
                            dead_code: true
                          }
                        }
                      },
                dir: 'build/js/app/',
                    findNestedDependencies: true,
                    paths: {        
                        TweenMax:'empty:',
                        SwiffyRuntime:'empty:'
                    }
                }
            }
        },*/
        
        uglify: {
            options: {
                compress: {                    
                    global_defs: {
                      DEBUG: false
                    },
                    dead_code: true,
                    drop_console: true,
                    drop_debugger: true,
                }
            },
            my_target: {
                files: [{
                    expand:true,
                    cwd:'src/',
                    src:'js/app/*.*',
                    dest:'build/'
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    /*grunt.loadNpmTasks('grunt-contrib-requirejs');*/

    // Default task(s).
    grunt.registerTask('css-optimisation', ['uncss','cssmin']);
    grunt.registerTask('default', ['copy','css-optimisation', 'uglify']);

}