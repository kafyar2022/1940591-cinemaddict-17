import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';

export default class FilmPresenter {
  #film = {};
  #filmContainer = null;
  #changeData = null;

  #popupPresenter = null;
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

  destroy = () => {
    remove(this.#filmComponent);
  };

  #handleFilmClick = () => {
    this.#popupPresenter.init(this.#film);
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };
}
