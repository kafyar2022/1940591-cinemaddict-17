import { UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import CommentsView from '../view/comments-view.js';
import CommentsLoadingView from '../view/comments-loading-view.js';

export default class CommentsPresenter {
  #commentsContainer = null;
  #commentsModel = null;
  #film = {};
  #uiBlocker = null;

  #isLoading = true;
  #loadingComponent = new CommentsLoadingView();
  #commentsComponent = null;

  constructor(commentsContainer, commentsModel, film, uiBlocker) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#film = film;
    this.#uiBlocker = uiBlocker;

    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = (comments) => {
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#commentsContainer);
      return;
    }

    if (this.#commentsComponent) {
      remove(this.#commentsComponent);
    }

    this.#commentsComponent = new CommentsView(comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteBtnClickHandler(this.#handleDeleteBtnClick);

    render(this.#commentsComponent, this.#commentsContainer);
  };

  #handleFormSubmit = (newComment) => {
    if (newComment.comment && newComment.emotion) {
      this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, { film: this.#film, comment: newComment });
    }
  };

  #handleDeleteBtnClick = (commentId) => {
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, { film: this.#film, commentId });
  };

  #handleViewAction = async (userAction, updateType, update) => {
    this.#uiBlocker.block();

    switch (userAction) {
      case UserAction.ADD_COMMENT:
        await this.#commentsModel.addCommentByFilmId(updateType, update);
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init(data);
        break;
      case UpdateType.PATCH:
        this.init(data.comments);
        break;
    }
  };
}
