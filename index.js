const optionsParser = require('./optionsParser');
const { log, done } = require('@vue/cli-shared-utils');

function run(args) {
  return serverPromise.then(() => {
    const testCafeArgs = ['testcafe', args.browser, args.testPath];
    const { spawn } = require('child_process');

    const runner = spawn('npx', testCafeArgs);
    runner.stdout.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        log(message);
      }
    });

    runner.on('exit', (code) => {
      process.exit(code);
    });

    return runner;
  });
}

module.exports = (api) => {
  api.registerCommand(
    'testcafe',
    {
      description: 'Run End-to-End tests with TestCafe',
      usage: 'vue-cli-service testcafe [options]',
    },
    async (args, options) => {
      log('Starting Testcafe');
      opts = opts || [];

      let browser = optionsParser.stringSetting(options, 'browser');
      if (!browser) {
        browser = 'chrome';
      }

      let testPath = optionsParser.stringSetting(options, 'tests');
      if (!testPath) {
        testPath = './tests/e2e/*.ts';
      }

      let vueMode = options.stringSetting(options, 'mode');
      if (!vueMode) {
        vueMode = 'development';
      }

      const { url, server } = await api.service.run('serve', { mode: vueMode });
      log(`Running TestCafe to ${url}`);

      return run().then(() => {
        server.close();
        done('TestCafe completed');
      });
    },
  );
};
