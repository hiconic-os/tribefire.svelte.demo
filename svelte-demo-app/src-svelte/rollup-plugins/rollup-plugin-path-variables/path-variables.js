import path from 'path';

export default function makeImportsRelative(pathMap) {
  return {
    name: 'path-variables',

    resolveId(lib, importer) {
      if (pathMap) {
        if (typeof pathMap != 'object') throw `pathMap must be an object`;

        let newPath = null;

        Object.entries(pathMap).some(([key, value]) => {
          if (lib.startsWith(key)) {
            newPath = path.join(value, lib.slice(key.length));
            return true;
          }
          return false;
        });

        return newPath;
      }

      return null;
    },
  };
}
