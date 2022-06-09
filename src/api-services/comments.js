import { Method } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class CommentsApiService extends ApiService {
  #id = null;

  constructor(endPoint, authorization, filmId) {
    super(endPoint, authorization);
    this.#id = filmId;
  }

  get comments() {
    return this._load({ url: `comments/${this.#id}` })
      .then(ApiService.parseResponse);
  }

  addComment = async (comment) => {
    const response = await this._load({
      url: `comments/${this.#id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({ 'Content-type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };
}
