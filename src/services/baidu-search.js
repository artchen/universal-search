var BaiduSearch;

(function($) {
  'use strict';

  /**
   * TODO
   * Search by Baidu Search API
   * @param options : (object)
   */
  BaiduSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "";
    self.addLogo('baidu');

    self.loadScript = function() {
      var script = "<script src='http://zhannei.baidu.com/api/customsearch/apiaccept?sid=" +self.config.apiId+ "&v=2.0&callback=customSearch.initBaidu' type='text/javascript' charset='utf-8'></script>";
      self.dom.body.append(script);
    };

    self.initBaidu = function() {
      self.cse = new BCse.Search(self.config.apiId);
    };

    /**
     * Get search results
     * @param queryText {String}
     * @param page {Integer}
     * @param callback {Function}
     */
    self.query = function(queryText, page, callback) {
      self.cse.setPageNum(self.config.per_page);
      self.cse.getResult(queryText, function(data) {
        console.log(data);
        if (callback instanceof Function) {
          callback();
        }
      }, page);
    };

    self.loadScript();
    
  };

})(jQuery);