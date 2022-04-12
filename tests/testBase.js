/** development tests
 *
 * @desc main file that runs all development tests
 * the grunt build is validated before by gitlab CI
 * then api tests, translation tests, etc. are run
 *
 * TODO:
 *  * enable and debug api tests
 *  * check for console.errors in browser => check with headless browser
 *  => see below
 */
// const async = require('async');
var blue = '\x1b[34m',
   red = '\x1b[31m',
   grey = '\x1b[90m',
   green = '\x1b[32m',
   defaultColor = '\x1b[0m';
let allErrors = [];

// configure mocha
const Mocha = require('mocha');

function mochaFile (file, opts, callback) {
   if (typeof opts === 'function') {
      callback = opts;
      opts = {};
   }
   opts = Object.assign({
      showErrors: true
   }, opts);

   mainLog('\n===== start mocha file ' + file);
   const mocha = new Mocha({
      // disable the reporter
      reporter: function (runner, options) { }
   });
   mocha.addFile(file);

   let passCount = 0;
   let errors = [];

   mocha.run()
      .on('suite', function (test) {
         console.log(' ' + test.title);
         console.log();
      })
      .on('pass', function (test) {
         passCount++;
         // logSuccess(test.title);
      })
      .on('fail', function (test, err) {
         errors.push({test, err});
         logError(test.title);
         if (opts.showErrors) {
            var errorMsg = err.message;
            // on custom error messages - we only show our custom error
            // so we cut away the second part after the ':'
            if (errorMsg.includes(':')) {
               errorMsg = errorMsg.split(':');
               errorMsg = errorMsg[0];
            }
            console.log('        ' + errorMsg);
            console.log();
         }
      })
      .on('end', function (test) {
         console.log();
         console.log(grey + '   -------------------------');
         logSuccess(passCount + ' tests passed');
         if (errors.length > 0) logError(errors.length + ' tests failed');
         allErrors = allErrors.concat(errors);
      });
}

function loggingTestResults () {
   setTimeout(function () { // little timeout, so everything can be printed on the console
      if (allErrors.length > 0) {
         console.log(red, `\n\n ===== FAIL: ${allErrors.length} TESTS FAILED\n\n`);
         process.exit(1);
      } else {
         mainLog(green + '\n\n\n===== SUCCESS: ALL TESTS =====\n\n');
         process.exit(0);
      }
   }, 200);
};


// start test with timeout so the webserver is prepared
setTimeout(function () {
   mainLog('\n\n\n===== BEGIN TESTS ===== \n\n');
   allErrors = [];
   mochaFile('./tests/testCases.js', loggingTestResults());
}, 2000);


function logSuccess (str) {
   console.log(green + '      ✓ ' + defaultColor + grey + str + defaultColor);
}

function logError (str) {
   console.log(red + '      ✖ ' + str + defaultColor);
}

function mainLog (message) {
   console.log(blue, message, defaultColor);
}
