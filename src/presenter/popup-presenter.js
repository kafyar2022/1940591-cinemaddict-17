import { UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import CommentsPresenter from './comments-presenter.js';

export default class PopupPresenter {
  #film = {};
  #popupComponent = null;

  #filmsModel = null;
  #commentsModel = null;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleFilmModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  init = (film) => {
    if (this.#film === film) {
      return;
    }
    this.#film = film;

    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
    }

    this.#popupComponent = new PopupView(this.#film);

    this.#popupComponent.setCloseBtnClickHandler(() => this.destroy());
    this.#popupComponent.setEscKeydownHandler(() => this.destroy());
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#renderComments();

    document.body.classList.add('hide-overflow');
    render(this.#popupComponent, document.body);
  };

  destroy() {
    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
    }
    if (this.#film !== null) {
      this.#film = null;
    }
  }

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;

      default:
        throw new Error('Undefined user action');
    }
  };

  #handleFilmModelEvent = (_, data) => {
    const scrollPosition = this.#popupComponent.element.scrollTop;
    this.destroy();
    this.init(data);
    this.#popupComponent.element.scroll(0, scrollPosition);
  };

  #handleCommentsModelEvent = (_, data) => {
    this.#film.comments.push(data.id);

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #renderComments = () => {
    const comments = this.#commentsModel.pickComments(this.#film.comments);
    const commentsPresenter = new CommentsPresenter(this.#popupComponent.commentsContainer, this.#handleViewAction);
    commentsPresenter.init(comments);
  };
}
