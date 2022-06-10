import { remove, render } from '../framework/render.js';
import FilmsWrapView from '../view/films-wrap-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreBtnView from '../view/load-more-btn-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import { FILM_COUNT_PER_STEP, PopupMode, SortType, UiBlockTimeLimit, UpdateType, UserAction } from '../const.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';
import PopupPresenter from './popup-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filterType = null;

  #renderedFilmsCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  #sortComponent = null;
  #noFilmsComponent = null;
  #popupPresenter = null;
  #filmsWrapComponent = new FilmsWrapView();
  #filmListComponent = new FilmListView();
  #loadMoreBtnComponent = new LoadMoreBtnView();
  #loadingComponent = new LoadingView();

  #filmPresenters = new Map();
  #uiBlocker = new UiBlocker(UiBlockTimeLimit.LOWER_LIMIT, UiBlockTimeLimit.UPPER_LIMIT);

  constructor(filmsContainer, filmsModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#popupPresenter = new PopupPresenter(this.#commentsModel, this.#handleViewAction);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
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
    for (let i = 0; i < Math.min(this.films.length, this.#renderedFilmsCount); i++) {
      this.#renderFilm(this.films[i]);
    }
    if (this.films.length > this.#renderedFilmsCount) {
      this.#renderLoadMoreBtn();
    }
  };

  #renderLoadMoreBtn = () => {
    this.#loadMoreBtnComponent.setClickHandler(this.#handleLoadMoreBtnClick);
    render(this.#loadMoreBtnComponent, this.#filmListComponent.element);
  };

  #handleLoadMoreBtnClick = () => {
    for (let i = this.#renderedFilmsCount; i < Math.min(this.films.length, this.#renderedFilmsCount + FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.films[i]);
    }
    this.#renderedFilmsCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmsCount >= this.films.length) {
      remove(this.#loadMoreBtnComponent);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListComponent.itemsContainer, this.#popupPresenter, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#uiBlocker.block();
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch (error) {
          this.#filmPresenters.get(update.id).setAborting();
          this.#popupPresenter.setFilmAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#uiBlocker.block();
        this.#popupPresenter.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch (error) {
          this.#popupPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.setDeleting();
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch (error) {
          this.#popupPresenter.setAborting();
        }
        break;
      default:
        throw new Error('Undefined user action');
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (data) {
          this.#filmPresenters.get(data.movie.id).init(data.movie);
          this.#popupPresenter.resetComments(data.comments);
        }
        this.#popupPresenter.resetComments(this.#commentsModel.comments);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsBoard();
        this.init();
        if (this.#popupPresenter.mode === PopupMode.OPENED) {
          this.#popupPresenter.resetDetails(data.userDetails);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.init();
        break;
      case UpdateType.INIT:
        if (this.#isLoading) {
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.init();
        }
        if (this.#popupPresenter.mode === PopupMode.OPENED) {
          this.#popupPresenter.isLoading = false;
          this.#popupPresenter.initComments(data);
        }
        break;
      default:
        throw new Error('Undefined user action');
    }
  };
}
