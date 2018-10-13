import * as $ from 'jquery';

export interface BaseServiceConfig {
  baseUrl?: string,
  selectors?: any;
  services?: any;
  imagePath?: string;
  resultsPerPage?: number;
}

export interface ResultEntry {
  url?: string;
  title?: string;
  excerpt?: string;
}

export interface DomElements {
  body?: JQuery;
  container?: JQuery;
  searchForm?: JQuery;
  searchInput?: JQuery;
  modal?: JQuery;
  modalBody?: JQuery;
  modalFooter?: JQuery;
  modalOverlay?: JQuery;
  modalResults?: JQuery;
  modalMetadata?: JQuery;
  modalMetadataTotal?: JQuery;
  modalMetadataRange?: JQuery;
  modalError?: JQuery;
  modalLoadingBar?: JQuery;
  modalAjaxContent?: JQuery;
  modalLogo?: JQuery;
  buttonClose?: JQuery;
  buttonNext?: JQuery;
  buttonPrev?: JQuery;
  [key:string]: JQuery;
}

export class BaseService {

  private readonly BODY_MODAL_ACTIVE_CLASS = 'us-modal__active';
  private readonly AJAX_CONTENT_LOADED_CLASS = 'loaded';

  private readonly TEMPLATE = `
    <div id="universal-search">
      <div class="us-modal">
        <header class="us-modal__header clearfix">
          <form class="us-modal__header__form u-search-form" name="universal_search_form">
            <input type="text" class="us-modal__header__form__input u-search-input" />
            <button type="submit" class="us-modal__header__form__submit">
              <span class="icon icon-search"></span>
            </button>
          </form>
          <a class="us-modal__close">
            <span class="icon icon-close"></span>
          </a>
          <div class="us-modal__loading">
            <div class="us-modal__loading__bar"></div>
          </div>
        </header>
        <main class="us-modal__body">
          <ul class="us-modal__results us-modal__ajax-content"></ul>
        </main>
        <footer class="us-modal__footer clearfix">
          <div class="us-modal__footer__metadata us-modal__ajax-content">
            <strong class="us-modal__footer__metadata__range"></strong> of <strong class="us-modal__footer__metadata__total"></strong>
          </div>
          <div class="us-modal__logo"></div>
          <a class="us-modal__nav us-modal__nav__next us-modal__ajax-content">
            <span class="text">NEXT</span>
            <span class="icon icon-chevron-right"></span>
          </a>
          <a class="us-modal__nav us-modal__nav__prev us-modal__ajax-content">
            <span class="icon icon-chevron-left"></span>
            <span class="text">PREV</span>
          </a>
        </footer>
      </div>
      <div class="us-modal__overlay"></div>
    </div>
  `;

  config: BaseServiceConfig = {
    selectors: {
      body: 'body',
      container: '#universal-search',
      searchForm: '.u-search-form',
      searchInput: '.u-search-input',
      modal: '#universal-search .us-modal',
      modalBody: '#universal-search .us-modal__body',
      modalFooter: '#universal-search .us-modal__footer',
      modalOverlay: '#universal-search .us-modal__overlay',
      modalResults: '#universal-search .us-modal__results',
      modalMetadata: '#universal-search .us-modal__footer__metadata',
      modalMetadataTotal: '#universal-search .us-modal__footer__metadata__total',
      modalMetadataRange: '#universal-search .us-modal__footer__metadata__range',
      modalLoadingBar: '#universal-search .us-modal__loading__bar',
      modalAjaxContent: '#universal-search .us-modal__ajax-content',
      modalLogo: '#universal-search .us-modal__logo',
      buttonClose: '#universal-search .us-modal__close',
      buttonNext: '#universal-search .us-modal__nav__next',
      buttonPrev: '#universal-search .us-modal__nav__prev'
    },
    services: {
      google: {
        logo: 'google.svg',
        url: 'https://cse.google.com'
      },
      algolia: {
        logo: 'algolia.svg',
        url: 'https://www.algolia.com'
      },
      azure: {
        logo: 'azure.svg',
        url: 'https://azure.microsoft.com/en-us/services/search/'
      },
      hexo: {
        logo: '',
        url: ''
      }
    },
    imagePath: '/img/',
    resultsPerPage: 10
  };

  dom: DomElements = {};
  percentLoaded = 0;
  isOpened = false;
  queryText = '';
  pagination = {
    next: -1,
    prev: -1,
    total: 0,
    current: 1
  };
  loadingTimer: number;

  constructor(customConfig: BaseServiceConfig) {
    this.config = {
      ...this.config,
      ...customConfig
    };
    $('body').append(this.TEMPLATE);
    Object.keys(this.config.selectors).forEach(selectorName => {
      this.dom[selectorName] = $(this.config.selectors[selectorName]);
    });
    this.dom.modalFooter.show();
    this.dom.modalOverlay.on('click', this.close.bind(this));
    this.dom.buttonClose.on('click', this.close.bind(this));
    this.dom.buttonNext.on('click', this.nextPage.bind(this));
    this.dom.buttonPrev.on('click', this.prevPage.bind(this));
    this.dom.searchForm.each((index: number, element: any) => {
      $(element).on('submit', this.onSubmit.bind(this));
    });
  }

  static buildResult(entry: ResultEntry) {
    return `
      <li>
        <a class="us-modal__result" href="${entry.url}">
          <span class="us-modal__result__title">${entry.title}</span>
          <span class="us-modal__result__excerpt">${entry.excerpt}</span>
          <span class="icon icon-chevron-thin-right"></span>
        </a>
      </li>
    `;
  }

  close() {
    this.isOpened = false;
    this.dom.container.fadeOut();
    this.dom.body.removeClass(this.BODY_MODAL_ACTIVE_CLASS);
  }

  beforeQuery() {
    if (!this.isOpened) {
      this.dom.container.fadeIn();
      this.dom.body.addClass(this.BODY_MODAL_ACTIVE_CLASS);
    }
    this.dom.searchInput.each((index: number, element: any) => {
      $(element).val(this.queryText);
    });
    $(document.activeElement).trigger('blur');
    this.dom.modalAjaxContent.removeClass(this.AJAX_CONTENT_LOADED_CLASS);
    this.dom.modalLoadingBar.show();
    this.loadingTimer = setInterval(() => {
      this.percentLoaded = Math.min(this.percentLoaded + 5, 95);
      this.dom.modalLoadingBar.css('width', `${this.percentLoaded}%`);
    }, 100);
  }

  afterQuery() {
    this.dom.modalBody.scrollTop(0);
    this.dom.modalAjaxContent.addClass(this.AJAX_CONTENT_LOADED_CLASS);
    clearInterval(this.loadingTimer);
    this.dom.modalLoadingBar.css('width', '100%');
    this.dom.modalLoadingBar.fadeOut();
    setTimeout(() => {
      this.percentLoaded = 0;
      this.dom.modalLoadingBar.css('width', '0%');
    }, 300);
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.queryText = `${$(event.target).find('.u-search-input').val()}`;
    if (this.queryText) {
      this.search(1);
    }
  }

  query(queryText: string, startIndex: number, callback?: Function) {
    // Default no-op query function.
    return callback();
  }

  search(startIndex: number) {
    this.beforeQuery();
    this.query(this.queryText, startIndex, this.afterQuery.bind(this));
  }

  nextPage() {
    if (this.pagination.next !== -1) {
      this.search(this.pagination.next);
    }
  }

  prevPage() {
    if (this.pagination.prev !== -1) {
      this.search(this.pagination.prev);
    }
  }

  onError(queryText: string, status: string) {
    let errorMessage = '';
    switch (status) {
      case 'success':
        errorMessage = `No result found for ${queryText}.`;
        break;
      case 'timeout':
        errorMessage = `Search timed out.`;
        break;
      default:
        errorMessage = `Mysterious error.`;
    }
    const errorHtml = `
      <li class="us-modal__error">
        ${errorMessage}
      </li>
    `;
    this.dom.modalResults.html(errorHtml);
  }

  addLogo(serviceName: string) {
    let html = '';
    const serviceConfig = this.config.services[serviceName];
    if (serviceConfig && serviceConfig.logo) {
      html += `
        <a href="${serviceConfig.url}" class="${serviceName}">
          <img src="${this.config.baseUrl || ''}${this.config.imagePath}${serviceConfig.logo}" />
        </a>
      `;
    }
    this.dom.modalLogo.html(html);
  }

}