var GoogleCustomSearch = "";

(function($) {
  'use strict';
  
  /**
   * Search by Google Custom Search Engine JSON API
   * @param options : (object)
   */
  GoogleCustomSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "https://www.googleapis.com/customsearch/v1";
    self.addLogo('google');

    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data) {
      var html = "";
      $.each(data, function(index, row) {
        var url = row.link;
        var title = row.title;
        var digest = (row.htmlSnippet || "").replace('<br>','');
        html += self.buildResult(url, title, digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw google custom search response data
     */
    self.buildMetadata = function(data) {
      if (data.queries && data.queries.request && data.queries.request[0].totalResults !== '0') {
        self.nav.current = data.queries.request[0].startIndex;
        self.nav.currentCount = data.queries.request[0].count;
        self.nav.total = parseInt(data.queries.request[0].totalResults);
        self.dom.modal_metadata.children('.total').html(self.nav.total);
        self.dom.modal_metadata.children('.range').html(self.nav.current + "-" + (self.nav.current+self.nav.currentCount-1));
        self.dom.modal_metadata.show();
      }
      else {
        self.dom.modal_metadata.hide();
      }
      if (data.queries && data.queries.nextPage) {
        self.nav.next = data.queries.nextPage[0].startIndex;
        self.dom.btn_next.show();
      }
      else {
        self.nav.next = -1;
        self.dom.btn_next.hide();
      }
      if (data.queries && data.queries.previousPage) {
        self.nav.prev = data.queries.previousPage[0].startIndex;
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
     * @param startIndex : (int) the index of first item (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, startIndex, callback) {
      $.get(endpoint, {
        key: self.config.apiKey,
        cx: self.config.engineId,
        q: queryText,
        start: startIndex,
        num: self.config.per_page
      }, function(data, status) {
        if (status === 'success' && data.items && data.items.length > 0) {
          var results = self.buildResultList(data.items); 
          self.dom.modal_results.html(results);       
        }
        else {
          self.onQueryError(queryText, status);
        }
        self.buildMetadata(data);
        if (callback) {
          callback();
        }
      });
    };
    
    return self;
  };
})(jQuery);