import path from 'path';
import fs from 'fs-extra';

const destDir = path.join(path.resolve(), '../src');
const rootSrc = path.join(path.resolve(), '../src');

// copy publicDir to destDir
// fs.copySync(publicDir, destDir);

// move deps from root dir folder to destDir
const libDir = path.join(path.resolve(), '../lib');

if (fs.existsSync(libDir)) {
  const dirs = fs.readdirSync(libDir);

  dirs.forEach((dirName) => {
    let dirPath = path.join(libDir + '/' + dirName);
    let stat = fs.lstatSync(dirPath);

    if (stat.isSymbolicLink) {
      dirPath = fs.realpathSync(dirPath);
      stat = fs.lstatSync(dirPath);
    }

    if (stat.isDirectory && dirPath != rootSrc) {
      fs.copySync(dirPath, path.join(destDir, 'lib', dirName));
    }
  });
}
