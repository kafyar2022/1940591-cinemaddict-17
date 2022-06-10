import { remove, render } from '../framework/render.js';
import FilmsWrapView from '../view/films-wrap-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreBtnView from '../view/load-more-btn-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import { FILM_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../const.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filterType = null;
  #popupPresenter = null;
  #uiBlocker = null;

  #renderedFilmsCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  #sortComponent = null;
  #filmsWrapComponent = new FilmsWrapView();
  #filmListComponent = new FilmListView();
  #loadMoreBtnComponent = new LoadMoreBtnView();
  #loadingComponent = new LoadingView();
  #noFilmsComponent = null;

  #filmPresenters = new Map();

  constructor(filmsContainer, filmsModel, commentsModel, filterModel, popupPresenter, uiBlocker) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#popupPresenter = popupPresenter;
    this.#uiBlocker = uiBlocker;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
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
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#filmsContainer);
      return;
    }

    if (!this.films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#filmsWrapComponent, this.#filmsContainer);
    render(this.#filmListComponent, this.#filmsWrapComponent.element);

    this.#renderFilms();
  };

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmsComponent, this.#filmsContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#filmsContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsBoard();
    this.init();
  };

  #clearFilmsBoard = ({ resetRenderedTaskCount = false, resetSortType = false } = {}) => {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#filmsWrapComponent);
    remove(this.#filmListComponent);
    remove(this.#loadMoreBtnComponent);
    remove(this.#noFilmsComponent);

    if (resetRenderedTaskCount) {
      this.#renderedFilmsCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        await this.#filmsModel.updateFilm(updateType, update);
        break;

      default:
        throw new Error('Undefined user action');
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsBoard();
        this.init();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
        break;
      default:
        throw new Error('Undefined user action');
    }
  };

  #handleCommentsModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.movie.id).init(data.movie);
        break;
    }
  };
}
