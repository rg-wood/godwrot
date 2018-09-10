module.exports = function (grunt) {
  'use strict'

  var pkg = grunt.file.readJSON('package.json')

  grunt.initConfig({
    copy: {
      main: {
        files: [
          {
            src: 'index.html',
            dest: 'dist/index.html'
          },
          {
            src: 'main.css',
            dest: 'dist/main.css'
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true,
            cwd: 'assets/',
            src: ['**', '!styles/**'],
            dest: 'dist/'
          }
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['index.html', 'package.json'],
        tasks: ['copy:main', 'string-replace']
      },
      assets: {
        files: ['assets/**'],
        tasks: ['copy:assets']
      },
      bower_components: {
        files: ['bower_components/**'],
        tasks: ['copy:bower_components']
      },
      node_modules: {
        files: ['node_modules/grisly-eye-doc-style/**', 'node_modules/ink-elements/**', 'node_modules/@webcomponents/**', 'node_modules/@polymer/**'],
        tasks: ['npmcopy:dist']
      }
    },

    clean: {
      release: ['dist']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'dist',
          hostname: 'localhost',
          livereload: true
        }
      }
    },

    npmcopy: {
      dist: {
        options: {
          destPrefix: 'dist/vendor'
        },
        files: {
          '@polymer': '@polymer',
          '@webcomponents': '@webcomponents',
          'grisly-eye-docs-style': 'grisly-eye-doc-style',
          'ink-elements': 'ink-elements',
          'vellum-monster': 'vellum-monster',
          'polymer-microdata': 'polymer-microdata',
          'microtesia.js': 'microtesia.js'
        }
      }
    },

    'string-replace': {
      dist: {
        files: {
          'dist/': 'index.html'
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: pkg.version
          },
          {
            pattern: /{{ AUTHOR }}/g,
            replacement: pkg.author.name
          },
          {
            pattern: /{{ COPYRIGHT_YEAR }}/g,
            replacement: pkg.copyright.year
          }]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-npmcopy')
  grunt.loadNpmTasks('grunt-string-replace')

  grunt.registerTask('default', ['copy', 'string-replace', 'npmcopy'])
  grunt.registerTask('run', ['clean', 'default', 'connect', 'watch'])
}
