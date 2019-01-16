const optionsParser = require('./optionsParser');
const { log, done } = require('@vue/cli-shared-utils');
const { spawn } = require('child_process');

const runTestCafe = (args) => {
  const testCafeArgs = ['testcafe', args.browser, args.testPath];
  return new Promise((resolve, reject) => {
    const runner = spawn('npx', testCafeArgs);
    runner.stdout.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        log(message);
      }
    });

    runner.on('error', (err) => {
      reject(code);
    });

    runner.on('exit', (code) => {
      resolve(code);
    });
  });
};

module.exports = (api) => {
  api.registerCommand(
    'testcafe',
    {
      description: 'Run End-to-End tests with TestCafe',
      usage: 'vue-cli-service testcafe [options]',
    },
    async (args, opts) => {
      log('Starting Testcafe');
      opts = opts || [];

      let browser = optionsParser.stringSetting(opts, 'browser');
      if (!browser) {
        browser = 'chrome';
      }

      let testPath = optionsParser.stringSetting(opts, 'tests');
      if (!testPath) {
        testPath = './tests/e2e/*.ts';
      }

      let vueMode = optionsParser.stringSetting(opts, 'mode');
      if (!vueMode) {
        vueMode = 'development';
      }

      const { url, server } = await api.service.run('serve', { mode: vueMode });
      log(`Running TestCafe to ${url}`);

      return runTestCafe({
        browser,
        testPath,
      }).then(() => {
        server.close();
        done('TestCafe completed');
      });
    },
  );
};
