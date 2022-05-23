import { remove, render } from '../framework/render.js';
import FilmsWrapView from '../view/films-wrap-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreBtnView from '../view/load-more-btn-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import { updateItem } from '../utils/common.js';
import { FILM_COUNT_PER_STEP, SortType } from '../const.js';
import { sortByDate, sortByRating } from '../utils/film.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;

  #filmsWrapComponent = new FilmsWrapView();
  #sortComponent = new SortView();
  #filmListComponent = new FilmListView();
  #loadMoreBtnComponent = new LoadMoreBtnView();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

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
    this.#sourcedFilms = [...this.#filmsModel.films];

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
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
        break;
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilmList();
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

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreBtnComponent);
  };
}
