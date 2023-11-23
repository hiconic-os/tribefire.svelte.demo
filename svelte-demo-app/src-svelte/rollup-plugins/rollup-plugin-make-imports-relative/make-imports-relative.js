import path from 'path';
import fs from 'fs-extra';

const buildJsPath = path.resolve(path.join(path.resolve(), '../src'));
const rootLibDir = path.resolve(path.join(path.resolve(), '../lib'));

export default function makeImportsRelative(
  { useLocalLibFolder } = { useLocalLibFolder: false }
) {
  return {
    name: 'make-imports-relative',

    resolveId(lib, importer) {
      if (!importer) return null;

      let sourcePath = path.resolve(path.join(path.basename(importer), lib));

      const isRootLibImport = sourcePath.startsWith(rootLibDir);

      if (isRootLibImport) {
        if (!fs.existsSync(sourcePath)) {
          if (fs.existsSync(sourcePath + '.js'))
            sourcePath = sourcePath + '.js';
          else if (fs.existsSync(sourcePath + '.mjs'))
            sourcePath = sourcePath + '.mjs';
          else throw `Can not resolve full filename for "${sourcePath}"`;
        }

        return {
          id: useLocalLibFolder
            ? path.relative(buildJsPath, sourcePath)
            : sourcePath,
          external: true,
        };
      }

      return null;
    },
  };
}
