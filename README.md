# Universal Search

This is a unified front-end client to integrate various 3rd-party search services. It is made to enable searching on platforms like [Hexo](http://hexo.io), [Ghost](http://ghost.org), and any general websites that don't already have searching.

This plugin is only a front-end client. You still need to register and configure the services, including create and upload site indexes. For detailed instruction on registration and configuration of these search services, please refer to my series of tutorials:

* [Universal Search #1 Common Logic](http://artifact.me/universal-search-1-common-logic/)
* [Universal Search #2 Google Custom Search Engine](http://artifact.me/universal-search-2-google-custom-search-engine/)
* [Universal Search #4 Algolia Search](http://artifact.me/universal-search-4-algolia-search/)
* [Universal Search #5 Azure Search](http://artifact.me/universal-search-5-azure-search/)
* <del>[Universal Search #3 Hexo Local Search](http://artifact.me/universal-search-3-hexo-local-search/)</del> (Support dropped in v2)
* <del>[Universal Search #6 Baidu Search](http://artifact.me/universal-search-6-baidu-search)</del> (Never managed to support)

This plugin depends on [jQuery](https://jquery.com/).

## Use in Production

Here are the files you need to include into your project:

* Everything under `./demo/fonts`.
* Everything under `./demo/img`.
* Load `./demo/universal-search.css` in `<head>`.
* Load `./demo/universal-search.js` after jQuery.

Enable a search service following the examples in `./demo/config.js`.

## Development

Clone this project and install.

```bash
git clone https://github.com/artchen/universal-search.git
npm install
npm build
```
