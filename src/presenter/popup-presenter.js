import { UpdateType, UserAction, PopupMode } from '../const.js';
import { remove, render } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import CommentsPresenter from './comments-presenter.js';
import PopupControlsView from '../view/popup-controls-view.js';

export default class PopupPresenter {
  #filmsModel = null;
  #commentsModel = null;
  #uiBlocker = null;

  #film = {};
  #popupComponent = null;
  #popupControlsComponent = null;
  #mode = PopupMode.CLOSED;

  constructor(filmsModel, commentsModel, uiBlocker) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#uiBlocker = uiBlocker;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get film() {
    return this.#film;
  }

  init = (film) => {
    this.#film = film;
    this.#commentsModel.init(this.#film.id);
    this.#mode = PopupMode.OPENED;


    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
    }

    this.#popupComponent = new PopupView(this.#film);

    this.#popupComponent.setCloseBtnClickHandler(() => this.destroy());
    this.#popupComponent.setEscKeydownHandler(() => this.destroy());

    this.#renderPopupControls();
    this.#renderComments();

    document.body.classList.add('hide-overflow');
    render(this.#popupComponent, document.body);

    this.#commentsModel.addObserver(this.#handleModelEvent);
  };

  destroy() {
    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
      this.#mode = PopupMode.CLOSED;
      this.#film = {};
    }
  }

  #renderPopupControls = () => {
    this.#popupControlsComponent = new PopupControlsView(this.#film.userDetails);
    this.#popupControlsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupControlsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupControlsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    render(this.#popupControlsComponent, this.#popupComponent.controlsContainer);
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;

    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
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
        case UpdateType.MINOR:
          if (this.#mode === 'opened') {
            this.#film = data;
            remove(this.#popupControlsComponent);
            this.#renderPopupControls();
          }
          break;
      }

      this.#popupComponent.element.scroll(0, scrollPosition);
    }
  };

  #renderComments = () => {
    const comments = this.#commentsModel.comments;
    const commentsPresenter = new CommentsPresenter(this.#popupComponent.commentsContainer, this.#commentsModel, this.#film, this.#uiBlocker);
    commentsPresenter.init(comments);
  };
}
