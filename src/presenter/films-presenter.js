import { remove, render } from '../framework/render.js';
import FilmsWrapView from '../view/films-wrap-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreBtnView from '../view/load-more-btn-view.js';
import FilmView from '../view/film-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsView from '../view/no-films-view.js';
import { FILM_COUNT_PER_STEP } from '../const.js';
import PopupView from '../view/popup-view.js';

export default class FilmPresenter {
  #filmsContainer = null;
  #filmsModel = null;

  #filmsWrapComponent = new FilmsWrapView();
  #sortComponent = new SortView();
  #filmListComponent = new FilmListView();
  #loadMoreBtnComponent = new LoadMoreBtnView();
  #popupComponent = null;

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
    if (!this.#films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsWrap();
    this.#renderFilmList();
  };

  #renderNoFilms = () => {
    render(new NoFilmsView(), this.#filmsContainer);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsContainer);
  };

  #renderFilmsWrap = () => {
    render(this.#filmsWrapComponent, this.#filmsContainer);
  };

  #renderFilmList = () => {
    render(this.#filmListComponent, this.#filmsWrapComponent.element);

    this.#renderFilmItems(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreBtn();

      this.#loadMoreBtnComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    }
  };

  #renderFilmItems = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderLoadMoreBtn = () => {
    render(this.#loadMoreBtnComponent, this.#filmListComponent.element);

    this.#loadMoreBtnComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #renderFilm = (film) => {
    const filmComponent = new FilmView(film);

    filmComponent.setClickHandler(() => {
      this.#renderPopup(film);
    });

    this.#filmListComponent.insertItem(filmComponent);
  };

  #renderPopup = (film) => {
    const prevPopup = this.#popupComponent;
    if (prevPopup !== null) {
      remove(prevPopup);
    }

    this.#popupComponent = new PopupView(film);
    render(this.#popupComponent, document.body);

    document.body.classList.add('hide-overflow');

    this.#popupComponent.setCloseBtnClickHandler(this.#closePopup);
    this.#popupComponent.setEscKeydownHandler(this.#closePopup);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmItems(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#loadMoreBtnComponent);
    }
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
  };
}
