module.exports = (api, options) => {
  function run(args, rawArgs) {
    const serverPromise = args.url
      ? Promise.resolve({ url: args.url })
      : api.service.run('serve', { mode: args.mode || 'development' });

    return serverPromise.then(({ url, server }) => {
      if (!server) {
        error('Server not running');
        process.exit(1);
        return;
      }

      const { info } = require('@vue/cli-shared-utils');
      info(`Starting e2e tests...`);

      const testCafeArgs = ['testcafe', 'chrome', './tests/e2e/'];
      const { spawn } = require('child_process');

      const runner = spawn('npx', testCafeArgs);
      runner.stdout.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
          info(message);
        }
      });

      runner.on('exit', (code) => {
        process.exit(code);
      });

      runner.on('error', () => server.close());

      return runner;
    });
  }

  api.registerCommand(
    'testcafe',
    {
      description: 'run e2e tests with TestCafe',
      usage: 'vue-cli-service testcafe [options]',
      options: Object.assign({
        // "--arg": "insert extra argument here"
      }),
    },
    (args, rawArgs) => run(args, rawArgs),
  );
};
