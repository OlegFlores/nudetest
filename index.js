const tests = [];

function test(name, fn) {
  tests.push({ name, fn })
}

module.exports = test;

const file = process.argv.slice(2);

if(!file) {
  console.warn('No file to test has been provided');
  process.exit();
}

require(`${process.cwd()}/${file}`);

const makePromise = (testName, fn) => {
  try {
    const res = fn();
    if(res && res.then) {
      return res.catch((reason) => {
        return Promise.resolve({testName: testName, passed: false,  reason: reason, sync: false});
      });
    } else {
      return Promise.resolve({testName: testName, passed: true, result: res});
    }
  } catch (e) {
    return Promise.resolve({testName: testName, passed: false,  reason: e, sync: true});
  }
};

const printResults = (testResults) => {
  testResults.forEach(testResult => {
    if(testResult.passed) {
      console.log('✅', testResult.testName)
    } else {
      console.log('❌', testResult.testName, testResult.sync ? '' : ' - error in synchronous code -');
    }
  });
  return testResults;
};

const getStats = (testResults) => {
  let passed = 0, failed = 0;
  testResults.forEach(testResult => {
    if(testResult.passed) {
      passed++;
    } else {
      failed++;
    }
  });
  return {
    passed, failed, total: passed + failed
  };
};

(function run() {
  const promises = tests.map(test => {
    return makePromise(test.name, test.fn);
  });
  Promise.all(promises)
    .then(results => printResults(results))
    .then(results => getStats(results))
    .then(stats => {
      console.log(`✅ Passed: ${stats.passed}\t❌ Failed: ${stats.failed}\tTotal: ${stats.total}`);
      if(stats.failed > 0) {
        process.exit(1);
      }
    })
}) ();

