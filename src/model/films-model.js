import { FILMS_QUANTITY } from '../const.js';
import { generateFilm } from '../mock/film.js';

export default class FilmsModel {
  #films = Array.from({ length: FILMS_QUANTITY }, generateFilm);

  get films() {
    return this.#films;
  }
}
