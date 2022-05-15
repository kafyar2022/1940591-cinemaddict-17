import dayjs from 'dayjs';

const getYearFromDate = (date) => dayjs(date).format('YYYY');

const humanizeFilmReleseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');

export {
  getYearFromDate,
  humanizeFilmReleseDate,
};
