import { createElement } from '../render.js';

export default class FilmsCountView {
  #element;

  get template() {
    return '<p>130 291 movies inside</p>';
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
