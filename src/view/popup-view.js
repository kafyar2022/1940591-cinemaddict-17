import { createElement } from '../render.js';
import { humanizeFilmReleseDate } from '../util.js';

const createFilmInfoTemplate = (film) => {
  const { filmInfo, runtime } = film;
  const { title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, release, genre, description } = filmInfo;

  return `<div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="${alternativeTitle}">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.map((writer) => writer).join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.map((actor) => actor).join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeFilmReleseDate(release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${genre.map((item) => `<span class="film-details__genre">${item}</span>`).join('')}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>`;
};

export default class PopupView {
  #element = null;
  #film = {};

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return `<section class="film-details">
              <form class="film-details__inner" action="" method="get">
                <div class="film-details__top-container">
                  <div class="film-details__close">
                    <button class="film-details__close-btn" type="button">close</button>
                  </div>

                  ${createFilmInfoTemplate(this.#film)}

                  <section class="film-details__controls">
                    <button type="button" class="film-details__control-button film-details__control-button--watchlist ${this.#film.userDetails.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
                    <button type="button" class="film-details__control-button  film-details__control-button--watched ${this.#film.userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
                    <button type="button" class="film-details__control-button film-details__control-button--favorite ${this.#film.userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
                  </section>
                </div>

                <div class="film-details__bottom-container">
                  <section class="film-details__comments-wrap">
                    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">0</span></h3>

                    <ul class="film-details__comments-list"></ul>

                    <div class="film-details__new-comment">
                      <div class="film-details__add-emoji-label"></div>

                      <label class="film-details__comment-label">
                        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                      </label>

                      <div class="film-details__emoji-list">
                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                        <label class="film-details__emoji-label" for="emoji-smile">
                          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                        </label>

                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                        <label class="film-details__emoji-label" for="emoji-sleeping">
                          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                        </label>

                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                        <label class="film-details__emoji-label" for="emoji-puke">
                          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                        </label>

                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                        <label class="film-details__emoji-label" for="emoji-angry">
                          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
              </form>
            </section>`;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
