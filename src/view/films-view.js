import { createElement } from '../render.js';

export default class FilmsView {
  #element = null;

  get template() {
    return '<section classs="films"></section>';
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
}
