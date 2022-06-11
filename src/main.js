import { render } from './framework/render.js';
import UserRankView from './view/user-rank-view.js';
import FilmsCountView from './view/films-count-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsApiService from './api-services/films.js';
import { AUTHORIZATION, END_POINT } from './const.js';
import CommentsModel from './model/comments-model.js';
import CommentsApiService from './api-services/comments.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const statisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new UserRankView(), siteHeaderElement);
render(new FilmsCountView(filmsModel.films), statisticsElement);

filterPresenter.init();
filmsPresenter.init();
filmsModel.init();
