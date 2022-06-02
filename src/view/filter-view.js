import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filterItems, currentFilterType) => `
  <nav class="main-navigation">
    ${filterItems
    .map(({ type, name, count }) => `
        <a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name}
          ${type !== FilterType.ALL ? `
            <span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>
          ` : ''}
        </a>
      `).join('')}
  </nav>
`;

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeClickHandler = (cb) => {
    this._callback.filterTypeClick = cb;

    this.element.addEventListener('click', this.#filterTypeClickHandler);
  };

  #filterTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
      evt.preventDefault();

      this._callback.filterTypeClick(evt.target.dataset.filterType);
    }
  };
}
