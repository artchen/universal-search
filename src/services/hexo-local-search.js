var HexoSearch;

(function($) {
  'use strict';
  
  /**
  * Search by Hexo generator json content
  * @param options : (object)
  */
  HexoSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    self.config.endpoint = (options||{}).endpoint || "/content.json";
    self.cache = "";
    
    /**
     * Search queryText in title and content of a post
     * Credit to: http://hahack.com/codes/local-search-engine-for-hexo/
     * @param post : the post object
     * @param queryText : the search query
     */
    self.contentSearch = function(post, queryText) {
      var post_title = post.title.trim().toLowerCase(),
          post_content = post.text.trim().toLowerCase(),
          keywords = queryText.trim().toLowerCase().split(" "),
          foundMatch = false,
          index_title = -1,
          index_content = -1,
          first_occur = -1;
      if (post_title !== '' && post_content !== '') {
        $.each(keywords, function(index, word) {
          index_title = post_title.indexOf(word);
          index_content = post_content.indexOf(word);
          if (index_title < 0 && index_content < 0) {
            foundMatch = false;
          }
          else {
            foundMatch = true;
            if (index_content < 0) {
              index_content = 0;
            }
            if (index === 0) {
              first_occur = index_content;
            }
          }
          if (foundMatch) {
            post_content = post.text.trim();
            var start = 0, end = 0;
            if (first_occur >= 0) {
              start = Math.max(first_occur-30, 0);
              end = (start === 0) ? Math.min(200, post_content.length) : Math.min(first_occur+170, post_content.length);
              var match_content = post_content.substring(start, end);
              keywords.forEach(function(keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<b>"+keyword+"</b>");
              });
              post.digest = match_content;
            }
            else {
              end = Math.min(200, post_content.length);
              post.digest = post_content.trim().substring(0, end);
            }
          }
        });
      }
      return foundMatch;
    };
    
    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data, queryText) {
      var results = [],
          html = "";
      $.each(data, function(index, post) {
        if (self.contentSearch(post, queryText))
          html += self.buildResult(post.permalink, post.title, post.digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw google custom search response data
     */
    self.buildMetadata = function(data) {
      self.dom.modal_footer.hide();
    };
    
    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param startIndex : (int) the index of first item (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, startIndex, callback) {
      if (!self.cache) {
        $.get(self.config.endpoint, {
          key: self.config.apiKey,
          cx: self.config.engineId,
          q: queryText,
          start: startIndex,
          num: self.config.per_page
        }, function(data, status) {
          if (status !== 'success' || 
              !data || 
              (!data.posts && !data.pages) || 
              (data.posts.length < 1 && data.pages.length < 1)
            ) {
            self.onQueryError(queryText, status);
          }
          else {
            self.cache = data;
            var results = ""; 
            results += self.buildResultList(data.pages, queryText);
            results += self.buildResultList(data.posts, queryText);
            self.dom.modal_results.html(results);
          }
          self.buildMetadata(data);
          if (callback) {
            callback(data);
          }
        }, 'json');
      }
      else {
        var results = ""; 
        results += self.buildResultList(self.cache.pages, queryText);
        results += self.buildResultList(self.cache.posts, queryText);
        self.dom.modal_results.html(results);
        self.buildMetadata(self.cache);
        if (callback) {
          callback(self.cache);
        }
      }
    };
    
    return self;
  };

})(jQuery);