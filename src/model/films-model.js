import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film.js';

const FILMS_COUNT = 17;

export default class FilmsModel extends Observable {
  #films = Array.from({ length: FILMS_COUNT }, generateFilm);

  get films() {
    return this.#films;
  }

  addFilm = (updateType, update) => {
    this.#films = [
      update,
      ...this.#films,
    ];

    this._notify(updateType, update);
  };

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
