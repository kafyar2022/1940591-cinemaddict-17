import { generateComment } from '../mock/comments.js';

export default class CommentsModel {
  #comments = Array.from({ length: 100000 }, generateComment);

  get comments() {
    return this.#comments;
  }
}
