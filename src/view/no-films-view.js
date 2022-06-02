import { NoFilmsTextType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createNoFilmsTemplate = (filterType) => `
  <section class="films-list">
    <h2 class="films-list__title">${NoFilmsTextType[filterType]}</h2>
  </section>
`;

export default class NoFilmsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFilmsTemplate(this.#filterType);
  }
}
