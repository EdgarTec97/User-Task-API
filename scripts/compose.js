const { spawn } = require('child_process');

const maxRetries = 4;
const delayMs = 1000;

function runDocker() {
  return new Promise((resolve) => {
    const proc = spawn('docker', ['compose', 'up', '-d', '--build', 'app'], {
      stdio: 'inherit',
    });
    proc.on('close', (code) => resolve(code));
  });
}

(async () => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const code = await runDocker();
    if (code === 0) process.exit(0);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  process.exit(1);
})();
