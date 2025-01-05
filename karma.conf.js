module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // Deja el reporte visible en el navegador
    },
    reporters: ['progress', 'kjhtml', 'coverage'], // Incluye coverage
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'), // Directorio de cobertura
      subdir: '.', // Genera archivos en la raíz de la carpeta coverage
      reporters: [
        { type: 'lcov', subdir: '.' }, // Genera lcov.info
        { type: 'html', subdir: 'lcov-report' }, // Reporte en HTML
        { type: 'text-summary' } // Resumen en consola
      ]
    },
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};
