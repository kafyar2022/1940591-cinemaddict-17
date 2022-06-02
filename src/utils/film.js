import dayjs from 'dayjs';

const getYearFromDate = (date) => dayjs(date).format('YYYY');

const sortByDate = (filmA, filmB) => dayjs(filmA.filmInfo.release.date).diff(dayjs(filmB.filmInfo.release.date));

const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

const formatDuration = (minutes) => {
  if (minutes > 59) {
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export {
  getYearFromDate,
  sortByDate,
  sortByRating,
  formatDuration,
};
