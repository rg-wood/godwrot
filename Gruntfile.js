module.exports = function (grunt) {
  'use strict'

  const pkg = grunt.file.readJSON('package.json')

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
            src: ['**'],
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
        tasks: ['copy:main', 'string-replace', 'exec:test']
      },
      assets: {
        files: ['assets/**'],
        tasks: ['copy:assets', 'exec:test']
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
          'modern-normalize': 'modern-normalize',
          pagedjs: 'pagedjs'
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

    exec: {
      test: {
        command: 'npm test',
        stdout: true,
        stderr: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-npmcopy')
  grunt.loadNpmTasks('grunt-string-replace')
  grunt.loadNpmTasks('grunt-exec')

  grunt.registerTask('default', ['copy', 'string-replace', 'npmcopy'])
  grunt.registerTask('run', ['default', 'connect', 'watch'])
}
