import { render } from '../render.js';
import BoardView from '../view/board-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';

export default class FilmPresenter {
  filmsBoard = new BoardView();
  allMovies = new FilmListView();

  init = (boardContainer) => {
    render(this.filmsBoard, boardContainer);
    render(this.allMovies, this.filmsBoard.getElement());

    for (let i = 0; i < 5; i++) {
      this.allMovies.addItem(new FilmView());
    }

    render(new LoadMoreButtonView(), this.allMovies.getElement());
  };
}
