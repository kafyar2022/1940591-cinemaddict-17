import { UpdateType, UserAction } from '../const.js';
import { render } from '../framework/render.js';
import CommentsView from '../view/comments-view.js';

export default class CommentsPresenter {
  #commentsContainer = null;
  #changeData = null;

  #commentsComponent = null;

  constructor(commentsContainer, changeData) {
    this.#commentsContainer = commentsContainer;
    this.#changeData = changeData;
  }

  init(comments) {
    this.#commentsComponent = new CommentsView(comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteBtnClickHandler(this.#handleDeleteBtnClick);

    render(this.#commentsComponent, this.#commentsContainer);
  }

  #handleFormSubmit = (comment) => {
    if (comment.text) {
      this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, comment);
    }
  };

  #handleDeleteBtnClick = (id) => {
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, id);
  };
}
