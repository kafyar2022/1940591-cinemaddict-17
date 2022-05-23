import { render } from './framework/render.js';
import UserRankView from './view/user-rank-view.js';
import FilterView from './view/filter-view.js';
import FilmsCountView from './view/films-count-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const statisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const boardPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

const filters = generateFilter(filmsModel.films);

render(new UserRankView(), siteHeaderElement);
render(new FilterView(filters), siteMainElement);
render(new FilmsCountView(filmsModel.films), statisticsElement);

boardPresenter.init();
