const FILMS_COUNT = 18;
const FILM_COUNT_PER_STEP = 5;
const AUTHORIZATION = 'Basic dsfjhskdfjsldf';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const UiBlockTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  FILMS_COUNT,
  FILM_COUNT_PER_STEP,
  FilterType,
  SortType,
  UpdateType,
  UserAction,
  NoFilmsTextType,
  Method,
  AUTHORIZATION,
  END_POINT,
  UiBlockTimeLimit,
};
