import { UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import CommentsView from '../view/comments-view.js';
import CommentsLoadingView from '../view/comments-loading-view.js';

export default class CommentsPresenter {
  #commentsContainer = null;
  #commentsModel = null;
  #isLoading = true;
  #loadingComponent = new CommentsLoadingView();

  #commentsComponent = null;

  constructor(commentsContainer, commentsModel) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = (comments) => {
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#commentsContainer);
      return;
    }

    this.#commentsComponent = new CommentsView(comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteBtnClickHandler(this.#handleDeleteBtnClick);

    render(this.#commentsComponent, this.#commentsContainer);
  };

  #handleFormSubmit = (comment) => {
    if (comment.text) {
      this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, comment);
    }
  };

  #handleDeleteBtnClick = (commentId) => {
    const update = this.#commentsModel.comments.find((comment) => comment.id === commentId);
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, update);
  };

  #handleViewAction = async (userAction, updateType, update) => {
    // eslint-disable-next-line no-console
    console.log(userAction, updateType, update);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init(data);
        break;
    }
  };
}
