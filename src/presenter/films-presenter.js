import { render } from '../render.js';
import FilmsContainerView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmView from '../view/film-view.js';
import NoFilmsView from '../view/no-films-view.js';
import { FILM_COUNT_PER_STEP } from '../const.js';
import PopupView from '../view/popup-view.js';

export default class FilmPresenter {
  #films = [];
  #filmsModel = null;
  #filmsContainer = null;
  #renderedFilmsCount = FILM_COUNT_PER_STEP;

  #filmsComponent = new FilmsContainerView();
  #filmListComponent = new FilmListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #popupComponent = null;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderFilms();
  };

  #renderFilms = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (!this.#films.length) {
      render(new NoFilmsView(), this.#filmsContainer);
      return;
    }

    render(this.#filmListComponent, this.#filmsComponent.element);

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.#filmListComponent.element);

      this.#loadMoreButtonComponent.element.addEventListener('click', this.#loadMoreButtonClickHandler);
    }
  };

  #renderFilm = (film) => {
    const filmComponent = new FilmView(film);

    const escKeydownHandler = () => {
      this.#popupComponent.element.remove();
      this.#popupComponent = null;
      document.body.classList.remove('hide-overflow');
    };

    const closePopup = () => {
      this.#popupComponent.element.remove();
      this.#popupComponent = null;

      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', escKeydownHandler);
    };

    filmComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();

      if (evt.target.closest('.film-card__link') !== null) {
        document.addEventListener('keydown', escKeydownHandler);
        document.body.classList.add('hide-overflow');

        this.#popupComponent = new PopupView(film);

        this.#popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', closePopup);

        render(this.#popupComponent, document.body);
      }
    });

    this.#filmListComponent.insertItem(filmComponent);
  };

  #loadMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };
}
