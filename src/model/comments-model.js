import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try {
      this.#comments = await this.#commentsApiService.comments;
    } catch (error) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT, this.#comments);
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#commentsApiService.addComment(update);

      this.#comments = response.comments;

      this._notify(updateType, this.comments);
    } catch (error) {
      throw new Error('Can\'t add new comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this._notify(updateType, this.comments);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

}
