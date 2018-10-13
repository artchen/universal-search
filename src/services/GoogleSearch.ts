import * as $ from 'jquery';
import {BaseService, BaseServiceConfig} from "./BaseService";

export interface GoogleSearchConfig extends BaseServiceConfig {
  engineId?: string;
  apiKey?: string;
}

export class GoogleSearch extends BaseService {
  private readonly serviceId = 'google';
  private serviceConfig: GoogleSearchConfig = this.config;
  private endpoint = "https://www.googleapis.com/customsearch/v1";

  constructor(config: GoogleSearchConfig) {
    super(config);
    this.serviceConfig = this.config;
    this.addLogo(this.serviceId);
  }

  buildResults(data: Array<any>) {
    let html = '';
    data.forEach((item: any) => {
      let url = item.link;
      let title = item.title;
      let excerpt = (item.htmlSnippet || '').replace('<br>', '');
      html += GoogleSearch.buildResult({
        url,
        title,
        excerpt
      });
    });
    return html;
  }

  buildMetadata(data: any) {
    if (data.queries && data.queries.request && data.queries.request[0].totalResults !== '0') {
      const result = data.queries.request[0];
      const currentPageSize = result.count;
      this.pagination.current = result.startIndex;
      this.pagination.total = parseInt(result.totalResults);
      this.dom.modalMetadataTotal.html(`${this.pagination.total}`);
      this.dom.modalMetadataRange.html(`${this.pagination.current} - ${this.pagination.current + currentPageSize - 1}`);
    } else {
      this.dom.modalMetadata.hide();
    }
    if (data.queries && data.queries.nextPage) {
      this.pagination.next = data.queries.nextPage[0].startIndex;
      this.dom.buttonNext.show();
    } else {
      this.pagination.next = -1;
      this.dom.buttonNext.hide();
    }
    if (data.queries && data.queries.previousPage) {
      this.pagination.prev = data.queries.previousPage[0].startIndex;
      this.dom.buttonPrev.show();
    } else {
      this.pagination.prev = -1;
      this.dom.buttonPrev.hide();
    }
  }

  query(queryText: string, startIndex: number, callback?: Function) {
    $.get(this.endpoint, {
      key: this.serviceConfig.apiKey,
      cx: this.serviceConfig.engineId,
      q: queryText,
      start: startIndex,
      num: this.serviceConfig.resultsPerPage
    }, (data: any, status: string) => {
      if (status === 'success' && data.items && data.items.length > 0) {
        const results = this.buildResults(data.items);
        this.dom.modalResults.html(results);
      } else {
        this.onError(queryText, status);
      }
      this.buildMetadata(data);
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
}