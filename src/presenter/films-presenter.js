import { render } from '../render.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmListView from '../view/film-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmView from '../view/film-view.js';

export default class FilmPresenter {
  #films;

  #filmsContainerView = new FilmsContainerView();
  #filmListView = new FilmListView();

  init = (element, filmsModel) => {
    this.#films = [...filmsModel.films];

    render(this.#filmsContainerView, element);
    render(this.#filmListView, this.#filmsContainerView.element);

    this.#films.forEach((film) => {
      this.#filmListView.insertItem(new FilmView(film));
    });

    render(new LoadMoreButtonView(), this.#filmListView.element);
  };
}
