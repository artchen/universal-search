var customSearch;

(function($) {
    var SEARCH_SERVICE = 'google'; // google|algolia|hexo|azure|baidu

    var GOOGLE_CUSTOM_SEARCH_API_KEY = "AIzaSyBFj4A2FRz36n1bLiOQbcGhmUdpM-buAZ0";
    var GOOGLE_CUSTOM_SEARCH_ENGINE_ID = "017821029378163458527:c46kp7iwut4";
    
    var ALGOLIA_API_KEY = "008d881e77dc9e73065e4635140fce5c";
    var ALGOLIA_APP_ID = "PAM0DKEGE7";
    var ALGOLIA_INDEX_NAME = "artifact.me";

    var AZURE_SERVICE_NAME = 'otakism';
    var AZURE_INDEX_NAME = 'artifact';
    var AZURE_QUERY_KEY = 'C1398F1CAD22087764DB51A21E4C2FDE';

    var BAIDU_API_KEY = '';

    if (SEARCH_SERVICE === 'google') {
      customSearch = new GoogleCustomSearch({
        apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
        engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID
      });
    }
    else if (SEARCH_SERVICE === 'algolia') {
      customSearch = new AlgoliaSearch({
        apiKey: ALGOLIA_API_KEY,
        appId: ALGOLIA_APP_ID,
        indexName: ALGOLIA_INDEX_NAME
      });
    }
    else if (SEARCH_SERVICE === 'hexo') {
      customSearch = new HexoSearch();
    }
    else if (SEARCH_SERVICE === 'azure') {
      customSearch = new AzureSearch({
        serviceName: AZURE_SERVICE_NAME,
        indexName: AZURE_INDEX_NAME,
        queryKey: AZURE_QUERY_KEY
      });
    }
    else if (SEARCH_SERVICE === 'baidu') {
      customSearch = new BaiduSearch({
        apiId: "8200259220702189810"
      });
    }
  })(jQuery);