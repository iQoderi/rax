import path from 'path';
import loaderUtils from 'loader-utils';
import traverseImport from './TraverseImport';

/**
 * remove universal-env module dependencies
 * convert to constant
 * then use babel-plugin-minify-dead-code-elimination remove the dead code
 *
 * @example
 *
 * ../evn-loader/lib/index?isWeex=true
 *
 * `import { isWeex, isWeb } from 'universal-env'`;
 *
 * after:
 *
 * ```
 * const isWeex = true;
 * const isWeb = false
 * ```
 */

module.exports = function(inputSource) {
  this.cacheable();
  const callback = this.async();

  const loaderOptions = loaderUtils.parseQuery(this.query);
  const resourcePath = this.resourcePath;
  const sourceMapTarget = path.basename(resourcePath);

  const options = Object.assign({ name: 'universal-env' }, loaderOptions);
  
  const { code, map } = traverseImport(options, inputSource, {
    sourceMaps: true,
    sourceMapTarget: sourceMapTarget,
    sourceFileName: resourcePath
  });

  callback(null, code, map);
};
