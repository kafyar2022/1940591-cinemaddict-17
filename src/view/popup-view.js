import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import { formatDuration } from '../utils/film.js';

const createFilmInfoTemplate = ({ filmInfo }) => `
  <div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}">

      <p class="film-details__age">${filmInfo.ageRating}</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${filmInfo.title}</h3>
          <p class="film-details__title-original">Original: ${filmInfo.title}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${Number(filmInfo.totalRating).toFixed(1)}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${filmInfo.director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${filmInfo.writers.map((writer) => writer).join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${filmInfo.actors.map((actor) => actor).join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${dayjs(filmInfo.release.date).format('D MMMM YYYY')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${formatDuration(filmInfo.runtime)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Genres</td>
          <td class="film-details__cell">
            <span class="film-details__genre">${filmInfo.genre.map((item) => item).join(', ')}</span>
          </td>
        </tr>
      </table>

      <p class="film-details__film-description">${filmInfo.description}</p>
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

  get controlsContainer() {
    return this.element.querySelector('.film-details__top-container');
  }

  setCloseBtnClickHandler = (cb) => {
    this._callback.closeBtnClick = cb;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeBtnClickHandler);
  };

  setEscKeydownHandler = (cb) => {
    this._callback.escKeydown = cb;

    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #closeBtnClickHandler = (evt) => {
    evt.preventDefault();

    document.body.classList.remove('hide-overflow');
    this._callback.closeBtnClick();
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      document.body.classList.remove('hide-overflow');
      this._callback.escKeydown();
    }
  };
}
