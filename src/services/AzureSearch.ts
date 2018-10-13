import * as $ from 'jquery';
import {BaseService, BaseServiceConfig} from "./BaseService";

export interface AzureSearchConfig extends BaseServiceConfig {
  serviceName?: string;
  indexName?: string;
  apiKey?: string;
}

export class AzureSearch extends BaseService {
  private readonly ODATA_COUNT = '@odata.count';
  private readonly serviceId = 'azure';
  private serviceConfig: AzureSearchConfig = this.config;
  private endpoint = `https://{serviceName}.search.windows.net/indexes/{indexName}/docs?api-version=2015-02-28`;

  constructor(config: AzureSearchConfig) {
    super(config);
    this.serviceConfig = this.config;
    this.addLogo(this.serviceId);
    this.endpoint = this.endpoint
      .replace('{serviceName}', config.serviceName)
      .replace('{indexName}', config.indexName);
    this.pagination.current = 1;
  }

  buildResults(data: Array<any>) {
    let html = '';
    data.forEach((item: any) => {
      let url = item.permalink || `/${item.path}` || '';
      let title = item.title;
      let excerpt = item.excerpt || '';
      html += AzureSearch.buildResult({
        url,
        title,
        excerpt
      });
    });
    return html;
  }

  buildMetadata(data: any, startIndex: number) {
    const nextStartIndex = startIndex + data.value.length;
    this.pagination.current = startIndex;
    this.pagination.total = parseInt(data[this.ODATA_COUNT]);
    this.dom.modalMetadataTotal.html(`${this.pagination.total}`);
    this.dom.modalMetadataRange.html(`${this.pagination.current} - ${nextStartIndex - 1}`);
    if (this.pagination.total > 0) {
      this.dom.modalMetadata.show();
    } else {
      this.dom.modalMetadata.hide();
    }
    if (nextStartIndex <= this.pagination.total) {
      this.pagination.next = nextStartIndex;
      this.dom.buttonNext.show();
    } else {
      this.pagination.next = -1;
      this.dom.buttonNext.hide();
    }
    if (this.pagination.current > 1) {
      this.pagination.prev = this.pagination.current - this.serviceConfig.resultsPerPage;
      this.dom.buttonPrev.show();
    } else {
      this.pagination.prev = -1;
      this.dom.buttonPrev.hide();
    }
  }

  query(queryText: string, startIndex: number, callback?: Function) {
    $.ajax({
      url: this.endpoint,
      headers: {
        'Accept': 'application/json',
        'api-key': this.serviceConfig.apiKey
      },
      data: {
        'search': queryText,
        '$orderby': 'date desc',
        '$skip': startIndex - 1,
        '$top': this.serviceConfig.resultsPerPage,
        '$count': true
      },
      type: 'GET',
      success: (data: any, status: string) => {
        if (status === 'success' && data.value && data.value.length > 0) {
          const results = this.buildResults(data.value);
          this.dom.modalResults.html(results);
        } else {
          this.onError(queryText, status);
        }
        this.buildMetadata(data, startIndex);
        if (typeof callback === 'function') {
          callback(data);
        }
      }
    });
  }
}