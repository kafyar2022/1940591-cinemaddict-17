import { remove, render } from '../framework/render.js';
import FilmsWrapView from '../view/films-wrap-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreBtnView from '../view/load-more-btn-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import { FILM_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../const.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';

export default class FilmsPresenter {
  #renderedFilmsCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #filterType = null;

  #sortComponent = null;
  #filmsWrapComponent = null;
  #filmListComponent = null;
  #loadMoreBtnComponent = null;
  #noFilmsComponent = null;
  #popupPresenter = null;

  #filmPresenters = new Map();

  constructor(filmsContainer, filmsModel, filterModel, popupPresenter) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#popupPresenter = popupPresenter;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmsBoard();
  };

  #renderFilmsBoard = () => {
    if (!this.films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsWrap();
  };

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmsComponent, this.#filmsContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#filmsContainer);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsBoard();
    this.#renderFilmsBoard();
  };

  #clearFilmsBoard = ({ resetRenderedTaskCount = false, resetSortType = false } = {}) => {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#filmsWrapComponent);
    remove(this.#filmListComponent);
    remove(this.#loadMoreBtnComponent);
    remove(this.#noFilmsComponent);
    this.#popupPresenter.destroy();

    if (resetRenderedTaskCount) {
      this.#renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(this.films.length, this.#renderedFilmsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsWrap = () => {
    this.#filmsWrapComponent = new FilmsWrapView();

    render(this.#filmsWrapComponent, this.#filmsContainer);
    this.#renderFilmList();
  };

  #renderFilmList = () => {
    this.#filmListComponent = new FilmListView();

    render(this.#filmListComponent, this.#filmsWrapComponent.element);

    this.#renderFilms();
  };

  #renderFilms = () => {
    const films = this.films;
    const filmsCount = films.length;

    for (let i = 0; i < Math.min(filmsCount, this.#renderedFilmsCount); i++) {
      this.#renderFilm(this.films[i]);
    }

    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderLoadMoreBtn();
    }
  };

  #renderLoadMoreBtn = () => {
    this.#loadMoreBtnComponent = new LoadMoreBtnView();
    this.#loadMoreBtnComponent.setClickHandler(this.#handleLoadMoreBtnClick);

    render(this.#loadMoreBtnComponent, this.#filmListComponent.element);
  };

  #handleLoadMoreBtnClick = () => {
    const films = this.films;
    const filmsCount = films.length;

    for (let i = this.#renderedFilmsCount; i < Math.min(filmsCount, this.#renderedFilmsCount + FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(films[i]);
    }
    this.#renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#loadMoreBtnComponent);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListComponent.itemsContainer, this.#popupPresenter, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;

      default:
        throw new Error('Undefined user action');
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsBoard();
        this.#renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderFilmsBoard();
        break;
      default:
        throw new Error('Undefined user action');
    }
  };
}
