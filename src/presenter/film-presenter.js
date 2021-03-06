import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';

export default class FilmPresenter {
  #filmContainer = null;
  #popupPresenter = null;
  #changeData = null;

  #film = {};
  #filmComponent = null;

  constructor(filmContainer, popupPresenter, changeData) {
    this.#filmContainer = filmContainer;
    this.#popupPresenter = popupPresenter;
    this.#changeData = changeData;
  }

  init(film) {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(this.#film);
    this.#filmComponent.setFilmClickHandler(this.#handleFilmClick);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);
    remove(prevFilmComponent);
  }

  resetComments = (newComments) => {
    this.#film = {
      ...this.#film,
      comments: newComments.map((comment) => comment.id),
    };

    this.init(this.#film);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  setAborting = () => {
    this.#filmComponent.shake();
  };

  #handleFilmClick = () => {
    if (this.#popupPresenter.film !== this.#film) {
      this.#popupPresenter.isLoading = true;
      this.#popupPresenter.init(this.#film);
    }
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };
}
