var AzureSearch;

(function($) {
  'use strict';

  /**
   * Search by Azure Search API
   * @param options : (object)
   */
  AzureSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "https://" +self.config.serviceName+ ".search.windows.net/indexes/" +self.config.indexName+ "/docs?api-version=2015-02-28";
    self.nav.current = 1;
    self.addLogo('azure');
    
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
        var digest = row.excerptStrip || "";
        html += self.buildResult(url, title, digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw response data
     * @param startIndex : (int) requested start index of current query
     */
    self.buildMetadata = function(data, startIndex) {
      self.nav.current = startIndex;
      self.nav.currentCount = data.value.length;
      self.nav.total = parseInt(data['@odata.count']);
      self.dom.modal_metadata.children('.total').html(self.nav.total);
      self.dom.modal_metadata.children('.range').html(self.nav.current + "-" + (self.nav.current+self.nav.currentCount-1));
      if (self.nav.total > 0) {
        self.dom.modal_metadata.show();
      }
      else {
        self.dom.modal_metadata.hide();
      }

      if (self.nav.current+self.nav.currentCount <= self.nav.total) {
        self.nav.next = self.nav.current+self.nav.currentCount;
        self.dom.btn_next.show();
      }
      else {
        self.nav.next = -1;
        self.dom.btn_next.hide();
      }
      if (self.nav.current > 1) {
        self.nav.prev = self.nav.current-self.config.per_page;
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
    self.query = function(queryText, startIndex, callback) {
      $.ajax({
        url: endpoint,
        headers: {
          "Accept": "application/json",
          "api-key": self.config.queryKey
        },
        data: {
          search: queryText,
          $skip: startIndex-1,
          $top: self.config.per_page,
          $count: true
        },
        type: "GET",
        success: function(data, status) {
          if (status === 'success' && data.value && data.value.length > 0) {
            var results = self.buildResultList(data.value);
            self.dom.modal_results.html(results);
          }
          else {
            self.onQueryError(queryText, status);
          }
          self.buildMetadata(data, startIndex);
          if (callback) {
            callback(data);
          }
        }
      });
    };

  };

})(jQuery);