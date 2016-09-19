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

    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data, queryText) {
      var results = [],
          html = "";
      $.each(data, function(index, post) {
        if (self.contentSearch(post, queryText))
          html += self.buildResult(post.linkUrl, post.title, post.abstract);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw google custom search response data
     */
    self.buildMetadata = function(data) {

    };

    self.loadScript = function() {
      self.dom.input.each(function(index,elem) {
        $(elem).attr('disabled', true);
      });
      var script = "<script src='http://zhannei.baidu.com/api/customsearch/apiaccept?sid=" +self.config.apiId+ "&v=2.0&callback=customSearch.initBaidu' type='text/javascript' charset='utf-8'></script>";
      self.dom.body.append(script);
    };

    self.initBaidu = function() {
      self.cse = new BCse.Search(self.config.apiId);
      //self.cse.setPageNum(self.config.per_page);
      self.dom.input.each(function(index,elem) {
        $(elem).attr('disabled', false);
      });
    };

    /**
     * Get search results
     * @param queryText {String}
     * @param page {Integer}
     * @param callback {Function}
     */
    self.query = function(queryText, page, callback) {
      self.cse.getResult(queryText, function(data) {
        console.log("Searching: " + queryText);
        console.log(data);
        self.cse.getError(function(data) {
          console.log(data);
        });
        if (data.length > 0) {
          self.buildResultList(data, queryText);
          self.cse.getSearchInfo(queryText, function(data) {
            console.log(data);
            self.buildMetadata(data);
          });
        }
        else {
          self.nav.total = 0;
          self.nav.next = -1;
          self.nav.prev = -1;
          self.dom.modal_metadata.hide();
          self.dom.btn_next.hide();
          self.dom.btn_prev.hide();
          self.onQueryError(queryText, "success");
        }
        if (callback instanceof Function) {
          callback();
        }
      });
    };

    self.loadScript();
    
  };

})(jQuery);