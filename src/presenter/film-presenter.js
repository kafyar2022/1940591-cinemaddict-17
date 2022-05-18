import { remove, render, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';

export default class FilmPresenter {
  #film = {};

  #filmContainer = null;
  #changePopup = null;

  #filmComponent = null;
  #popupComponent = null;


  constructor(filmContainer, changePopup) {
    this.#filmContainer = filmContainer;
    this.#changePopup = changePopup;
  }

  init(film) {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(this.#film);

    this.#filmComponent.setClickHandler(this.#handleFilmClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this.#filmComponent);
  }

  resetPopup() {
    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
    }
  }

  #handleFilmClick = () => {
    if (this.#popupComponent === null) {
      this.#changePopup();
      this.#renderPopup();
    }
  };

  #renderPopup = () => {
    this.#popupComponent = new PopupView(this.#film);

    render(this.#popupComponent, document.body);

    document.body.classList.add('hide-overflow');

    this.#popupComponent.setCloseBtnClickHandler(this.#handlePopupClose);
    this.#popupComponent.setEscKeydownHandler(this.#handlePopupClose);
  };

  #handlePopupClose = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;

    document.body.classList.remove('hide-overflow');
  };
}
