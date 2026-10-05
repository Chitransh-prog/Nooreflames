import fs from 'fs';
import path from 'path';

const targetFile = path.resolve('node_modules', 'simple-zstd', 'dist', 'src', 'index.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  if (content.includes("throw new Error('Can not access zstd! Is it installed?');")) {
    content = content.replace(
      /let bin;\s*try\s*\{[^}]*where zstd\.exe[^}]*throw new Error\('Can not access zstd! Is it installed\?'\);[^}]*throw new Error\('zstd is not executable'\);\s*\}/s,
      `let bin = '';
try {
    bin = (0, node_child_process_1.execSync)(find, { env: process.env }).toString().replace(/\\n$/, '').replace(/\\r$/, '');
    debug(bin);
    node_fs_1.default.accessSync(bin, node_fs_1.default.constants.X_OK);
}
catch {
    // zstd binary not in PATH; postponed until compression is actually called
}`
    );
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✓ simple-zstd Windows compatibility patch applied.');
  }
}
