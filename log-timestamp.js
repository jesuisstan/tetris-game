// to log timestamp on each console.log

const { execFile } = require('child_process');

const timestamp = () => {
  const now = new Date();
  return `[${now.toLocaleString()}]`;
};

const child = execFile(process.argv[2], process.argv.slice(3), (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(stdout);
});

child.stdout.on('data', data => {
  process.stdout.write(`${timestamp()} ${data}`);
});

child.stderr.on('data', data => {
  process.stderr.write(`${timestamp()} ${data}`);
});

