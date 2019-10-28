const { resolve } = require(`path`);
const _ = require(`lodash`);
const glob = require(`glob`);

/*
  * getGlobbedPaths: Get files by glob patterns
  * @in: globPatterns: \/*\/**\/thing.js
  *      excludes: \/*\/**\/thing.php
  * out: ['/file/path-1', '/file/path-2']
  */
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  const urlRegex = new RegExp(`^(?:[a-z]+:)?\/\/`, `i`);

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(globPattern => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns))
      output.push(globPatterns);
    else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(file => {
          if (_.isArray(excludes)) {
            for (const i in excludes) {
              if (excludes.hasOwnProperty(i))
                file = file.replace(excludes[i], ``);
            }
          } else
            file = file.replace(excludes, ``);

          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};


/*
  * requireGlob: include files by glob patterns from directories
  * @in: globPatterns: \/*\/**\/thing.js | [\/*\/**\/thing.js]
  *      excludes: \/*\/**\/thing.php
  * out: ['/file/path-1', '/file/path-2']
  */
const requireGlob = (globPatterns, excludes, log) => {
  const getName = l => {
    try {
      let ll = l.split(`/`);
      ll = ll[ll.length - 1];
      ll = ll.split(`.js`);
      if (ll.length <= 1)
        return null;
      ll = ll.splice(0, 1);
      ll = ll.join(`.`);
      return ll;
    } catch (error) {
      throw error;
    }
  };
  const buildMap = list => {
    try {
      const map = {};
      list.forEach(l => {
        const name = getName(l);

        if (!name)
          return;

        if (name in map) {
          let key = name;
          while (key in map)
            key = `_${key}`;

          map[key] = l;
        } else
          map[name] = l;
      });
      Object.keys(map).forEach(k => {
        map[k] = require(resolve(map[k]));
      });
      return map;
    } catch (error) {
      throw error;
    }
  };

  globPatterns = Array.isArray(globPatterns) ? globPatterns : [ globPatterns ];

  const list = getGlobbedPaths(globPatterns, excludes);
  const map = buildMap(list);

  return map;
};

module.exports = {
  requireGlob,
};
