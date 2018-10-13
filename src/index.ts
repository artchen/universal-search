import {AlgoliaSearch, AzureSearch, GoogleSearch} from './services';
import './universal-search.less';

let universalSearchInstance = {};

/**
 * Universal search.
 */
(() => {
  const config: any = (<any>window).universalSearchConfig || {};


  switch(config.searchService) {
    case 'algolia':
      universalSearchInstance = new AlgoliaSearch(config);
      break;
    case 'azure':
      universalSearchInstance = new AzureSearch(config);
      break;
    case 'google':
      universalSearchInstance = new GoogleSearch(config);
      break;
    default:
      console.warn(`Unsupported search service id: ${config.searchService}.`);
      break;
  }

})();