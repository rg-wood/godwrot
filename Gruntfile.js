module.exports = function (grunt) {
  'use strict'

  var pkg = grunt.file.readJSON('package.json')

  var resolve = require('rollup-plugin-node-resolve')

  grunt.initConfig({
    copy: {
      main: {
        files: [
          {
            src: 'index.html',
            dest: 'dist/html/index.html'
          },
          {
            src: 'main.css',
            dest: 'dist/html/main.css'
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true,
            cwd: 'assets/',
            src: ['**', '!styles/**', '!scripts/**'],
            dest: 'dist/html/'
          }
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['index.html', 'main.css', 'package.json'],
        tasks: ['copy:main', 'string-replace']
      },
      assets: {
        files: ['assets/**'],
        tasks: ['copy:assets']
      },
      vendor_modules: {
        files: [
          'node_modules/grisly-eye-doc-style/**/*',
          '!node_modules/grisly-eye-doc-style/**/node_modules/**/*'
        ],
        tasks: ['npmcopy:dist']
      },
      rollup_modules: {
        files: [
          'node_modules/ink-elements/**/*',
          '!node_modules/ink-elements/**/node_modules/**/*',
          'node_modules/vellum-monster/**/*',
          '!node_modules/vellum-monster/**/node_modules/**/*',
          'node_modules/vellum-sheet/**/*',
          '!node_modules/vellum-sheet/**/node_modules/**/*'
        ],
        tasks: ['rollup']
      }
    },

    clean: {
      release: ['dist']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'dist/html',
          hostname: 'localhost',
          livereload: true
        }
      }
    },

    npmcopy: {
      dist: {
        options: {
          destPrefix: 'dist/html/vendor'
        },
        files: {
          'grisly-eye-docs-style': 'grisly-eye-doc-style',
          'modern-normalize': 'modern-normalize'
        }
      }
    },

    'string-replace': {
      dist: {
        files: {
          'dist/html/': '*.html'
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
    },

    rollup: {
      options: {
        format: 'es',
        plugins: [
          resolve()
        ]
      },
      dist: {
        files: {
          'dist/html/scripts/ink.js': 'assets/scripts/ink.js'
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
  grunt.loadNpmTasks('grunt-rollup')

  grunt.registerTask('default', ['copy', 'string-replace', 'npmcopy', 'rollup'])
  grunt.registerTask('run', ['default', 'connect', 'watch'])
}
