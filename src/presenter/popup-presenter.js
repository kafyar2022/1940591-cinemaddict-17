import { UpdateType, UserAction, END_POINT, AUTHORIZATION, UiBlockTimeLimit } from '../const.js';
import { remove, render } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import CommentsPresenter from './comments-presenter.js';
import CommentsModel from '../model/comments-model.js';
import CommentsApiService from '../api-services/comments.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class PopupPresenter {
  #film = {};
  #popupComponent = null;

  #filmsModel = null;
  #commentsModel = null;
  #uiBlocker = new UiBlocker(UiBlockTimeLimit.LOWER_LIMIT, UiBlockTimeLimit.UPPER_LIMIT);

  constructor(filmsModel) {
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get film() {
    return this.#film;
  }

  init = (film) => {
    this.#film = film;
    this.#commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION, this.film.id));
    this.#commentsModel.init();


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

    this.#commentsModel.addObserver(this.#handleModelEvent);
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
    if (this.#popupComponent !== null) {
      const scrollPosition = this.#popupComponent.element.scrollTop;

      switch (updateType) {
        case UpdateType.PATCH:
          this.destroy();
          this.init(data);
          break;
      }

      this.#popupComponent.element.scroll(0, scrollPosition);
    }
  };

  #renderComments = () => {
    const comments = this.#commentsModel.comments;
    const commentsPresenter = new CommentsPresenter(this.#popupComponent.commentsContainer, this.#commentsModel);
    commentsPresenter.init(comments);
  };
}
