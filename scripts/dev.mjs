import { spawn } from 'node:child_process';
import { config } from 'dotenv';

config();

const isWin = process.platform === 'win32';

function run(command, args, label) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: isWin,
    env: process.env,
  });
  child.on('exit', (code) => {
    if (code && code !== 0) console.error(`[dev] ${label} terminó con código ${code}`);
  });
  return child;
}

const docApi = run('node', ['scripts/doc-api-dev.mjs'], 'doc-api');
const astro = run('pnpm', ['astro', 'dev'], 'astro');

function shutdown() {
  docApi.kill();
  astro.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
