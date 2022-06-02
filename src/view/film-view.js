import AbstractView from '../framework/view/abstract-view.js';
import { formatDuration, getYearFromDate } from '../utils/film.js';

const createFilmTemplate = ({ comments, filmInfo, userDetails }) => `
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${Number(filmInfo.totalRating).toFixed(1)}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYearFromDate(filmInfo.release.date)}</span>
        <span class="film-card__duration">${formatDuration(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre.map((item) => item).join(', ')}</span>
      </p>
      <img src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>
`;

export default class FilmView extends AbstractView {
  #film = {};

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  setFilmClickHandler = (cb) => {
    this._callback.click = cb;

    this.element.addEventListener('click', this.#cardClickHandler);
  };

  setWatchlistClickHandler = (cb) => {
    this._callback.watchlistClick = cb;

    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (cb) => {
    this._callback.watchedClick = cb;

    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (cb) => {
    this._callback.favoriteClick = cb;

    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #cardClickHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains('film-card__controls-item')) {
      this._callback.click();
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
