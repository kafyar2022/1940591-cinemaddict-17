import { remove, render } from '../framework/render.js';
import FilmsContainerView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmView from '../view/film-view.js';
import NoFilmsView from '../view/no-films-view.js';
import { FILM_COUNT_PER_STEP } from '../const.js';
import PopupView from '../view/popup-view.js';

export default class FilmPresenter {
  #filmsContainer = null;
  #filmsModel = null;

  #filmsComponent = new FilmsContainerView();
  #filmListComponent = new FilmListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  #films = [];
  #renderedFilmsCount = FILM_COUNT_PER_STEP;

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

      this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    }
  };

  #renderFilm = (film) => {
    const filmComponent = new FilmView(film);

    filmComponent.setClickHandler(() => {
      const popupComponent = new PopupView(film);

      const handleEscKeydown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          remove(popupComponent);
          document.removeEventListener('keydown', handleEscKeydown);
        }
      };

      render(popupComponent, document.body);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', handleEscKeydown);

      popupComponent.setCloseButtonClickHandler(() => {
        remove(popupComponent);
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', handleEscKeydown);
      });
    });

    this.#filmListComponent.insertItem(filmComponent);
  };

  #handleLoadMoreButtonClick = () => {
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
