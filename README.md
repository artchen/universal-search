# Universal Search

This is a unified front-end client to integrate various 3rd-party search services. It is made to enable searching on platforms like [Hexo](http://hexo.io), [Ghost](http://ghost.org), and any general websites that don't already have searching.

Please keep in mind that this plugin is only a front-end client. You still need to register and configure the services, including create and upload site indexes. For detailed instruction on registration and configuration of these search services, please refer to my series of tutorials:

* [Universal Search #1 Common Logic](http://artifact.me/universal-search-1-common-logic/)
* [Universal Search #2 Google Custom Search Engine](http://artifact.me/universal-search-2-google-custom-search-engine/)
* [Universal Search #3 Hexo Local Search](http://artifact.me/universal-search-3-hexo-local-search/)
* [Universal Search #4 Algolia Search](http://artifact.me/universal-search-4-algolia-search/)
* [Universal Search #5 Azure Search](http://artifact.me/universal-search-5-azure-search/)
* [Universal Search #6 Baidu Search](http://artifact.me/universal-search-6-baidu-search)

Please also be aware that this front-end client requires [jQuery](https://jquery.com/).

## Production

* Copy all files under `/dist` directory into your project. 
* Make sure you have jQuery loaded on your page.
* Load the contents in `style.css` and `universal-search.js` on your page.
* Enable a search service like the following examples:

### Google Custom Search

```javascript
var customSearch;
(function() {
  customSearch = new GoogleCustomSearch({
    apiKey: "YOUR_GOOGLE_CUSTOM_SEARCH_API_KEY",
    engineId: "YOUR_GOOGLE_CUSTOM_SEARCH_ENGINE_ID"
  });
})();
```

### Algolia Search

```javascript
var customSearch;
(function() {
  customSearch = new AlgoliaSearch({
    apiKey: "YOUR_ALGOLIA_API_KEY",
    appId: "YOUR_ALGOLIA_APPLICATION_ID",
    indexName: "YOUR_ALGOLIA_INDEX_NAME"
  });
})();
```

### Hexo Local Search

```javascript
var customSearch;
(function() {
  customSearch = new HexoSearch();
})();
```

### Azure Search

```javascript
var customSearch;
(function() {
  customSearch = new AzureSearch({
    serviceName: "YOUR_AZURE_SERVICE_NAME",
    indexName: "YOUR_AZURE_INDEX_NAME",
    queryKey: "YOUR_AZURE_QUERY_KEY"
  });
});
```

### Baidu Search (dev in progress)

```javascript
var customSearch;
(function() {
  customSearch = new BaiduSearch({
    apiId: "YOUR_BAIDU_API_ID"
  });
})();
```

You must keep the relative path of `style.css` and `/fonts`, otherwise your need to change the paths in `style.less` to make sure it finds the font files.

## Demo

This repository contains a demo folder. Please replace your credentials in `demo/config.js` to preview.

## Development

Clone this project and install.

```bash
git clone https://github.com/artchen/universal-search.git
npm install
```

To change the HTML template, please modify `src/template.html` and replace the corresponding variable in `src/universal-search.js`.