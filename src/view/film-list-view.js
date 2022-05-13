import { createElement, render } from '../render.js';

export default class FilmListView {
  #element = null;

  get template() {
    return `<section class="films-list">
              <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
              <div class="films-list__container"></div>
            </section>`;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }

  insertItem(filmComponent) {
    render(filmComponent, this.#element.querySelector('.films-list__container'));
  }
}
