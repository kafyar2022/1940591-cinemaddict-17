import { remove, render } from '../framework/render.js';
import FilmsWrapView from '../view/films-wrap-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreBtnView from '../view/load-more-btn-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import { updateItem } from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;

  #filmsWrapComponent = new FilmsWrapView();
  #sortComponent = new SortView();
  #filmListComponent = new FilmListView();
  #loadMoreBtnComponent = new LoadMoreBtnView();

  #films = [];
  #comments = [];
  #renderedFilmsCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  constructor(filmsContainer, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#comments = [...commentsModel.comments];
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
    const filmPresenter = new FilmPresenter(this.#filmListComponent.filmsContainer, this.#handlePopupChange, this.#handleFilmChange);
    const comments = Array.from(film.comments, (commentId) => this.#comments.find((comment) => comment.id === commentId));

    filmPresenter.init(film, comments);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handlePopupChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmItems(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#loadMoreBtnComponent);
    }
  };
}
