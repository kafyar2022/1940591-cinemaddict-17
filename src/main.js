import { render } from './render.js';
import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import FilmsCountView from './view/films-count-view.js';
import FilmPresenter from './presenter/films-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsPresenter = new FilmPresenter();
const statisticsElement = document.querySelector('.footer__statistics');

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new SortView(), siteMainElement);
render(new FilmsCountView(), statisticsElement);

filmsPresenter.init(siteMainElement);
