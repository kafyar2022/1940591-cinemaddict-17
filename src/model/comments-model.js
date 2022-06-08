import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comments.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({ length: 1000 }, generateComment);

  get comments() {
    return this.#comments;
  }

  pickComments = (commentIds) => this.#comments.filter((comment) => commentIds.includes(comment.id));

  addComment = (updateType, update) => {
    const newComments = {
      id: nanoid(),
      author: 'Some Author',
      comment: update.text,
      date: dayjs().format(),
      emotion: update.emotion,
    };

    this.#comments = [
      ...this.#comments,
      newComments,
    ];

    this._notify(updateType, newComments);
  };

  deleteComment = (id) => (this.#comments = this.#comments.filter((comment) => comment.id !== id));
}
