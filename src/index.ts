/**
 * @module index
 */

import { LoaderDefinitionFunction } from 'webpack';

export default (function loader() {
  this.getOptions();
} as LoaderDefinitionFunction);
