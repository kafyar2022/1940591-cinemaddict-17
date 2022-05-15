import AbstractView from '../framework/view/abstract-view.js';

export default class FilmsCountView extends AbstractView{
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return `<p>${this.#films.length} movies inside</p>`;
  }
}
