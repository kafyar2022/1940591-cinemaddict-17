import { UpdateType, UserAction, PopupMode } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import DetailsView from '../view/details-view.js';
import CommentsView from '../view/comments-view.js';
import CommentsLoadingView from '../view/comments-loading-view.js';

export default class PopupPresenter {
  #commentsModel = null;
  #changeData = null;

  #film = {};
  #popupComponent = null;
  #detailsComponent = null;
  #commentsComponent = null;

  #mode = PopupMode.DEFAULT;
  #isLoading = true;
  #isSaving = false;
  #isDeleting = false;
  #deleteBtn = null;
  #loadingComponent = new CommentsLoadingView();

  constructor(commentsModel, changeData) {
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  get film() {
    return this.#film;
  }

  get mode() {
    return this.#mode;
  }

  get isLoading() {
    return this.#isLoading;
  }

  set isLoading(boolean) {
    this.#isLoading = boolean;
  }

  init = (film) => {
    this.#film = film;
    this.#commentsModel.init(this.film.id);
    this.#mode = PopupMode.OPENED;

    this.#renderPopup();
    this.#renderDetails();
    this.#renderComments();

    document.body.classList.add('hide-overflow');
    render(this.#popupComponent, document.body);
  };

  destroy = () => {
    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
      this.#mode = PopupMode.DEFAULT;
      this.#film = {};
    }
  };

  resetDetails = (details) => {
    const prevDetailsComponent = this.#detailsComponent;
    this.#detailsComponent = new DetailsView(details);
    this.#detailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#detailsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#detailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    replace(this.#detailsComponent, prevDetailsComponent);
    remove(prevDetailsComponent);
  };

  initComments = (comments) => {
    this.#commentsComponent = new CommentsView(comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteBtnClickHandler(this.#handleDeleteBtnClick);

    replace(this.#commentsComponent, this.#loadingComponent);
    remove(this.#loadingComponent);
  };

  resetComments = (comments) => {
    this.#isSaving = false;
    this.#isDeleting = false;
    const prevCommentsComponent = this.#commentsComponent;
    this.#commentsComponent = new CommentsView(comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteBtnClickHandler(this.#handleDeleteBtnClick);

    if (prevCommentsComponent === null) {
      render(this.#commentsComponent, this.#commentsComponent);
      return;
    }
    replace(this.#commentsComponent, prevCommentsComponent);
    remove(prevCommentsComponent);
  };

  setSaving = () => (this.#isSaving = true);

  setDeleting = () => {
    this.#isDeleting = true;
    this.#deleteBtn.textContent = 'Deleting...';
  };

  setFilmAborting = () => this.#detailsComponent.shake();

  setAborting = () => {
    this.#commentsComponent.shake();
    this.#isSaving = false;
    this.#isDeleting = false;
    if (this.#deleteBtn) {
      this.#deleteBtn.textContent = 'Delete';
    }
  };

  #renderPopup = () => {
    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
    }
    this.#popupComponent = new PopupView(this.#film);
    this.#popupComponent.setCloseBtnClickHandler(() => this.destroy());
    this.#popupComponent.setEscKeydownHandler(() => this.destroy());
  };

  #renderDetails = () => {
    this.#detailsComponent = new DetailsView(this.#film.userDetails);
    this.#detailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#detailsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#detailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    render(this.#detailsComponent, this.#popupComponent.detailsContainer);
  };

  #renderComments = () => {
    if (this.isLoading) {
      render(this.#loadingComponent, this.#popupComponent.commentsContainer);
      return;
    }
    this.#commentsComponent = new CommentsView(this.#commentsModel.comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteBtnClickHandler(this.#handleDeleteBtnClick);

    render(this.#commentsComponent, this.#popupComponent.commentsContainer);
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

  #handleFormSubmit = (newComment) => {
    if (!this.#isSaving && newComment.comment && newComment.emotion) {
      this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, { film: this.#film, comment: newComment });
    }
  };

  #handleDeleteBtnClick = (evt) => {
    if (!this.#isDeleting) {
      this.#deleteBtn = evt.target;

      this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, evt.target.dataset.id);
    }
  };
}
