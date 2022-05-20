import { remove, render, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';
import CommentsView from '../view/comments-view.js';

export default class FilmPresenter {
  #film = {};
  #comments = [];

  #filmContainer = null;
  #changePopup = null;
  #changeData = null;

  #filmComponent = null;
  #popupComponent = null;
  #commentsComponent = null;


  constructor(filmContainer, changePopup, changeData) {
    this.#filmContainer = filmContainer;
    this.#changePopup = changePopup;
    this.#changeData = changeData;
  }

  init(film, comments) {
    this.#film = film;
    this.#comments = comments;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(this.#film);

    this.#filmComponent.setClickHandler(this.#handleFilmClick);
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

  destroy() {
    remove(this.#filmComponent);
  }

  resetPopup() {
    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
    }
  }

  #handleFilmClick = () => {
    if (this.#popupComponent === null) {
      this.#changePopup();
      this.#renderPopup();
    }
  };

  #renderPopup = () => {
    this.#popupComponent = new PopupView(this.#film);

    render(this.#popupComponent, document.body);
    this.#popupComponent.setCloseBtnClickHandler(this.#handlePopupClose);
    this.#popupComponent.setEscKeydownHandler(this.#handlePopupClose);
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#renderComments();

    document.body.classList.add('hide-overflow');
  };

  #handlePopupClose = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;

    document.body.classList.remove('hide-overflow');
  };

  #handleWatchlistClick = () => {
    this.#changeData({ ...this.#film, userDetails: { ...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist } });
    this.#popupComponent.toggleWatchlistClass();
  };

  #handleWatchedClick = () => {
    this.#changeData({ ...this.#film, userDetails: { ...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched } });
    this.#popupComponent.toggleWatchedClass();
  };

  #handleFavoriteClick = () => {
    this.#changeData({ ...this.#film, userDetails: { ...this.#film.userDetails, favorite: !this.#film.userDetails.favorite } });
    this.#popupComponent.toggleFavoriteClass();
  };

  #renderComments = () => {
    this.#commentsComponent = new CommentsView(this.#comments);

    render(this.#commentsComponent, this.#popupComponent.commentsContainer);
  };
}
