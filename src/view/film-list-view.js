import { createElement, render } from '../render.js';

const getFilmsContainerTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmListView {
  getTemplate() {
    return getFilmsContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

  addItem(element) {
    render(element, this.getElement().querySelector('.films-list__container'));
  }
}
