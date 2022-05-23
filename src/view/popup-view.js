import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFilmReleseDate } from '../utils/film.js';

const createFilmInfoTemplate = (film) => `
  <div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="./${film.filmInfo.poster}" alt="${film.filmInfo.alternativeTitle}">

      <p class="film-details__age">${film.filmInfo.ageRating}</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${film.filmInfo.title}</h3>
          <p class="film-details__title-original">Original: ${film.filmInfo.title}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${film.filmInfo.totalRating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${film.filmInfo.director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${film.filmInfo.writers.map((writer) => writer).join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${film.filmInfo.actors.map((actor) => actor).join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${humanizeFilmReleseDate(film.filmInfo.release.date)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${film.filmInfo.runtime}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${film.filmInfo.release.releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Genres</td>
          <td class="film-details__cell">
            ${film.filmInfo.genre.map((item) => `<span class="film-details__genre">${item}</span>`).join('')}
          </td>
        </tr>
      </table>

      <p class="film-details__film-description">${film.filmInfo.description}</p>
    </div>
  </div>
`;

const createPopupTemplate = (film) => `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>

        ${createFilmInfoTemplate(film)}

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${film.userDetails.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button  film-details__control-button--watched ${film.userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${film.userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container"></div>
    </form>
  </section>
`;

export default class PopupView extends AbstractView {
  #film = {};

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupTemplate(this.#film);
  }

  get commentsContainer() {
    return this.element.querySelector('.film-details__bottom-container');
  }

  setCloseBtnClickHandler = (cb) => {
    this._callback.closeBtnClick = cb;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeBtnClickHandler);
  };

  setEscKeydownHandler = (cb) => {
    this._callback.escKeydown = cb;

    document.addEventListener('keydown', this.#escKeydownHandler);
  };

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

  toggleWatchlistClass = () => this.element.querySelector('.film-details__control-button--watchlist').classList.toggle('film-details__control-button--active');

  toggleWatchedClass = () => this.element.querySelector('.film-details__control-button--watched').classList.toggle('film-details__control-button--active');

  toggleFavoriteClass = () => this.element.querySelector('.film-details__control-button--favorite').classList.toggle('film-details__control-button--active');

  #closeBtnClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.closeBtnClick();
  };

  #escKeydownHandler = (evt) => {
    evt.preventDefault();

    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._callback.escKeydown();
    }
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
