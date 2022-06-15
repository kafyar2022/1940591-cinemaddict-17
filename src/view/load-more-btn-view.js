import AbstractView from '../framework/view/abstract-view.js';

export default class LoadMoreBtnView extends AbstractView {
  get template() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  setClickHandler = (cb) => {
    this._callback.click = cb;

    this.element.addEventListener('click', this.#btnClickHandler);
  };

  #btnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
