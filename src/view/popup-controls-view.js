import AbstractView from '../framework/view/abstract-view.js';

export default class PopupControlsView extends AbstractView {
  #controls = null;

  constructor(controls) {
    super();
    this.#controls = controls;
  }

  get template() {
    return `<section class="film-details__controls">
              <button type="button" class="film-details__control-button film-details__control-button--watchlist ${this.#controls.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
              <button type="button" class="film-details__control-button  film-details__control-button--watched ${this.#controls.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
              <button type="button" class="film-details__control-button film-details__control-button--favorite ${this.#controls.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
            </section>`;
  }

  setWatchlistClickHandler = (cb) => {
    this._callback.watchlistClick = cb;

    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (cb) => {
    this._callback.watchedClick = cb;

    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (cb) => {
    this._callback.favoriteClick = cb;

    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.favoriteClick();
  };
}
