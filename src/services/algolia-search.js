var AlgoliaSearch;

(function($) {
  'use strict';

  /**
   * Search by Algolia Search
   * @param options : (object)
   */
  AlgoliaSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "https://" +self.config.appId+ "-dsn.algolia.net/1/indexes/" +self.config.indexName;
    self.addLogo('algolia');
    
    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data) {
      var html = "";
      $.each(data, function(index, row) {
        var url = row.permalink || row.path || "";
        if (!row.permalink && row.path) {
          url = "/" + url;
        }
        var title = row.title;
        var digest = row._highlightResult.excerptStrip.value || "";
        html += self.buildResult(url, title, digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw search response data
     */
    self.buildMetadata = function(data) {
      self.nav.current = data.page * data.hitsPerPage + 1;
      self.nav.currentCount = data.hits.length;
      self.nav.total = parseInt(data.nbHits);
      self.dom.modal_metadata.children('.total').html(self.nav.total);
      self.dom.modal_metadata.children('.range').html(self.nav.current + "-" + (self.nav.current+self.nav.currentCount-1));
      if (self.nav.total > 0) {
        self.dom.modal_metadata.show();
      }
      else {
        self.dom.modal_metadata.hide();
      }

      if (data.page < data.nbPages-1) {
        self.nav.next = (data.page+1)+1;
        self.dom.btn_next.show();
      }
      else {
        self.nav.next = -1;
        self.dom.btn_next.hide();
      }
      if (data.page > 0) {
        self.nav.prev = (data.page+1)-1;
        self.dom.btn_prev.show();
      }
      else {
        self.nav.prev = -1;
        self.dom.btn_prev.hide();
      }
    };
    
    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param page : (int) the current page (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, page, callback) {
      $.get(endpoint, {
        query: queryText,
        page: page-1,
        hitsPerPage: self.config.per_page,
        "x-algolia-application-id": self.config.appId,
        "x-algolia-api-key": self.config.apiKey
      }, function(data, status) {
        if (status === 'success' && data.hits && data.hits.length > 0) {
          var results = self.buildResultList(data.hits); 
          self.dom.modal_results.html(results);
        }
        else {
          self.onQueryError(queryText, status);
        }
        self.buildMetadata(data);
        if (callback) {
          callback(data);
        }
      });
    };
    
  };

})(jQuery);