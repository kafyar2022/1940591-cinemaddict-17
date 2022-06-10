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

  init = async (filmId) => {
    try {
      this.#comments = await this.#commentsApiService.getCommentsByFilmId(filmId);
    } catch (error) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT, this.#comments);
  };

  addCommentByFilmId = async (updateType, update) => {
    let response = {};

    try {
      response = await this.#commentsApiService.addCommentByFilmId(update);
    } catch (error) {
      throw new Error('Can\'t add new comment');
    }

    response.movie = this.#adaptFilmToClient(response.movie);
    this._notify(updateType, response);
  };

  deleteComment = async (updateType, update) => {
    const film = update.film;
    const index = this.#comments.findIndex((comment) => comment.id === update.commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update.commentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      film.comments = [...this.#comments.map((comment) => Number(comment.id))];
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }

    this._notify(updateType, { movie: film, comments: this.#comments });
  };

  #adaptFilmToClient = (film) => {
    const adaptedFilm = {
      ...film,
      'filmInfo': {
        ...film.film_info,
        'alternativeTitle': film.film_info.alternative_title,
        'totalRating': film.film_info.total_rating,
        'ageRating': film.film_info.age_rating,
        'release': {
          ...film.film_info.release,
          'releaseCountry': film.film_info.release.release_country,
        },
      },
      'userDetails': {
        ...film.user_details,
        'alreadyWatched': film.user_details.already_watched,
        'watchingDate': film.user_details.watching_date,
      },
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;
  };
}
