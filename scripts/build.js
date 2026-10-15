import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
rmSync('artifacts', { recursive: true, force: true });
cpSync('src', 'dist', { recursive: true });
mkdirSync('artifacts', { recursive: true });
console.log('Built dist/ with the server and website assets.');
