import * as $ from 'jquery';
import {BaseService, BaseServiceConfig} from "./BaseService";

export interface AlgoliaSearchConfig extends BaseServiceConfig {
  appId?: string,
  apiKey?: string,
  indexName?: string
}

export class AlgoliaSearch extends BaseService {
  private readonly serviceId = 'algolia';
  private serviceConfig: AlgoliaSearchConfig = this.config;
  private endpoint = `https://{appId}-dsn.algolia.net/1/indexes/{indexName}`;

  constructor(config: AlgoliaSearchConfig) {
    super(config);
    this.endpoint = this.endpoint
      .replace('{appId}', config.appId)
      .replace('{indexName}', config.indexName);
    this.addLogo(this.serviceId);
  }

  buildResults(data: Array<any>) {
    let html = '';
    data.forEach((item: any) => {
      let url = item.permalink || `/${item.path}` || '';
      let title = item.title;
      let excerpt = item._highlightResult.excerptStrip.value || '';
      html += AlgoliaSearch.buildResult({
        url,
        title,
        excerpt
      });
    });
    return html;
  }

  buildMetadata(data: any) {
    const currentPageSize = data.hits.length;
    this.pagination.current = data.page * data.hitsPerPage + 1;
    this.pagination.total = parseInt(data.nbHits);
    this.dom.modalMetadataTotal.html(`${this.pagination.total}`);
    this.dom.modalMetadataRange.html(`${this.pagination.current} - ${this.pagination.current + currentPageSize - 1}`);
    if (this.pagination.total > 0) {
      this.dom.modalMetadata.show();
    } else {
      this.dom.modalMetadata.hide();
    }
    if (data.page < data.nbPages - 1) {
      this.pagination.next = (data.page + 1) + 1; // data.page is 0-based
      this.dom.buttonNext.show();
    } else {
      this.pagination.next = -1;
      this.dom.buttonNext.hide();
    }
    if (data.page > 0) {
      this.pagination.prev = (data.page + 1) - 1;
      this.dom.buttonPrev.show();
    } else {
      this.pagination.prev = -1;
      this.dom.buttonPrev.hide();
    }
  }

  query(queryText: string, page: number, callback?: Function) {
    $.get(this.endpoint, {
      query: queryText,
      page: page - 1,
      hitsPerPage: this.serviceConfig.resultsPerPage,
      'x-algolia-application-id': this.serviceConfig.appId,
      'x-algolia-api-key': this.serviceConfig.apiKey
    }, (data: any, status: string) => {
      if (status === 'success' && data.hits && data.hits.length > 0) {
        const results = this.buildResults(data.hits);
        this.dom.modalResults.html(results);
      }
      else {
        this.onError(queryText, status);
      }
      this.buildMetadata(data);
      if (typeof callback === 'function') {
        callback(data);
      }
    });
  }
}