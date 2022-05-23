import dayjs from 'dayjs';

const getYearFromDate = (date) => dayjs(date).format('YYYY');

const humanizeFilmReleseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');

const sortByDate = (filmA, filmB) => dayjs(filmA.filmInfo.release.date).diff(dayjs(filmB.filmInfo.release.date));

const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {
  getYearFromDate,
  humanizeFilmReleseDate,
  sortByDate,
  sortByRating,
};
