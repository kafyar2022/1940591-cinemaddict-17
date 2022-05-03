import { createElement } from '../render.js';

const getFilmsBoardTemplate = () => (
  '<section classs="films"></section>'
);

export default class BoardView {
  getTemplate() {
    return getFilmsBoardTemplate();
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
}
