import { render } from './framework/render.js';
import UserRankView from './view/user-rank-view.js';
import FilmsCountView from './view/films-count-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import PopupPresenter from './presenter/popup-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const statisticsElement = document.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const popupPresenter = new PopupPresenter(filmsModel, commentsModel);
const boardPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel, popupPresenter);


render(new UserRankView(), siteHeaderElement);
render(new FilmsCountView(filmsModel.films), statisticsElement);

filterPresenter.init();
boardPresenter.init();
