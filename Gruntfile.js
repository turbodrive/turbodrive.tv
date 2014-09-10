module.exports = function (grunt) {

    // Configuration de Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        replace: {
          dist: {
            options: {
              patterns: [
                {
                  match: '<script type="text/javascript" src="js/lib/Stats.js"></script>',
                  replacement: ''
                },{
                  match: '<link type="text/css" rel="stylesheet" href="css/bootstrap.min.css">',
                  replacement: ''
                },{
                  match: 'debug:true,',
                  replacement: 'debug:false,'
                },{
                  match: 'hyperDriveTransition:false,',
                  replacement: 'hyperDriveTransition:true,'
                },{
                  match: 'volumeReel:0',
                  replacement: 'volumeReel:1'
                }
              ],
                usePrefix: false
            },
            files: [
              {expand: true, flatten:true, src: ['src/index.html'], dest: 'build/'},
              {expand: true, flatten:true, src: ['src/js/app/main.js'], dest: 'tmp_tasks/js/app/'}
            ]
          }
        },

        
        copy: {          
          main: {
            files: [
              {expand: true, cwd: 'src/', src: [
                  '*.html','favicon/**','*.xml','*.ico',
                  'js/**/*.*',
                  '!js/app/**/*.*',
                  'php/*',
                  'css/**/*.*',
                  '!css/turbodrive.css',
                  'images/**'
              ],
               dest: 'build/'},
            ]
          },
          dev: {
            files: [
              {expand: true, cwd: 'src/', src: [
                  '*.html','favicon/**','*.xml','*.ico',
                  'js/**/*.*',
                  '!js/app/**/*.*',
                  'php/*',
                  'css/**/*.*',
                  'images/**'
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
                report: 'min', // optional: include to report savings
                ignore: ['body.texture-background',
                        '.hd-prtcle',
                        '.hd-prtcle-tex',
                        '.grid', 
                        '.textPlane380', 
                        '.textPlane',
                        'div.block01',
                        'div.block02',
                        'div.block03',
                        'div.block04',
                        'div.block-corner',
                        'img.white-line',
                        '.timeline',
                        '#timelineMask',
                        '#timelineSvg',
                        '#bgProgress',
                        '.navbar-stealth',
                        '.navbar-stealth .container',
                        '.navbar-stealth .navbar-header',
                        '.navbar-stealth .highlightContainer',
                        'html.ios7 > body',
                        '.redLine-sprite3d',
                        '#project-video',
                        '#project-video.pause-video',
                        '.project-player',
                        '.navbar-stealth .highlightContainer',
                        '.highlight',
                        '::-webkit-input-placeholder',
                        ':-moz-placeholder',
                        '::-moz-placeholder',
                        ':-ms-input-placeholder',
                        ':focus',
                        '.form-feedback.success',
                        '.form-feedback.error'
                        ]
            }
          }
        },
        
        cssmin: {
          minify : {
            src: ['build/css/turbodrive.un.css'],
            dest: 'build/css/turbodrive.css'
          }
        },

        
        uglify: {
            my_target: {
                options: {
                    beautify:false,
                    compress: {                    
                        global_defs: {
                          DEBUG: false
                        },
                        dead_code: true,
                        drop_console: true,
                        drop_debugger: true,
                    }
                },
                
                files: [{
                    expand:true,
                    cwd:'src/',
                    src:'js/app/*.*',
                    dest:'build/'
                },{
                    expand:true,
                    cwd:'src/',
                    src:'js/assets/*.*',
                    dest:'build/'
                },{
                    expand:true,
                    cwd:'tmp_tasks/',
                    src:'js/app/*.*',
                    dest:'build/'
                }]   
            },
            dev : {
                options: {
                    beautify:false,
                    compress: {                    
                        global_defs: {
                          DEBUG: false
                        },
                        dead_code: false,
                        drop_console: false,
                        drop_debugger: false,
                    }
                },
                
                files: [{
                    expand:true,
                    cwd:'src/',
                    src:'js/app/*.*',
                    dest:'build/'
                },{
                    expand:true,
                    cwd:'src/',
                    src:'js/assets/*.*',
                    dest:'build/'
                }]                
            }
        },
    });
        
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('css-optimisation', ['uncss','cssmin']);
    grunt.registerTask('default', ['replace','copy:main','css-optimisation', 'uglify:my_target']);
    grunt.registerTask('dev', ['copy:dev', 'uglify:dev']);

}