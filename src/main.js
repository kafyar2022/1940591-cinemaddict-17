import { render } from './framework/render.js';
import ProfileView from './view/profile-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FilmsCountView from './view/films-count-view.js';
import FilmPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const statisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filmsPresenter = new FilmPresenter(siteMainElement, filmsModel);

const filters = generateFilter(filmsModel.films);

render(new ProfileView(), siteHeaderElement);
render(new FilterView(filters), siteMainElement);
render(new SortView(), siteMainElement);
render(new FilmsCountView(filmsModel.films), statisticsElement);

filmsPresenter.init();
