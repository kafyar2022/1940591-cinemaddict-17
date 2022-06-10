import { Method } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class CommentsApiService extends ApiService {
  getCommentsByFilmId = async (filmId) => this._load({
    url: `comments/${filmId}`,
  })
    .then(ApiService.parseResponse);

  addCommentByFilmId = async ({film, comment}) => this._load({
    url: `comments/${film.id}`,
    method: Method.POST,
    body: JSON.stringify(comment),
    headers: new Headers({ 'Content-type': 'application/json' }),
  })
    .then(ApiService.parseResponse);

  deleteComment = async (id) => this._load({
    url: `comments/${id}`,
    method: Method.DELETE,
  });
}
