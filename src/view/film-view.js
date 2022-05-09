import { createElement } from '../render.js';
import { getYearFromDate } from '../util.js';

export default class FilmView {
  #element;
  #filmModel;

  constructor(filmModel) {
    this.#filmModel = filmModel;
  }

  get template() {
    const { comments, filmInfo, userDetails } = this.#filmModel;

    return `<article class="film-card">
            <a class="film-card__link">
              <h3 class="film-card__title">${filmInfo.title}</h3>
              <p class="film-card__rating">${Number(filmInfo.ageRating).toFixed(1)}</p>
              <p class="film-card__info">
                <span class="film-card__year">${getYearFromDate(filmInfo.release.date)}</span>
                <span class="film-card__duration">${filmInfo.runtime}m</span>
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
          </article>`;
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
