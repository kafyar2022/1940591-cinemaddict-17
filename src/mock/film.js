import dayjs from 'dayjs';
import { AGE_RATING, COUNTRIES, FILMS, GENRE, NAMES } from '../const.js';
import { generateRandomId, getRandomArrayElement, getRandomArrayElements, getRandomInteger } from '../util.js';

const generateCommentId = generateRandomId(1, 1000000);
const generateCommentIds = () => Array.from({ length: getRandomInteger(0, 100) }, generateCommentId);

export const generateFilm = (_, i) => {
  const film = getRandomArrayElement(FILMS);
  const releaseDate = dayjs().add(getRandomInteger(1, 90), 'day').format();
  const watchingDate = dayjs(releaseDate).add(getRandomInteger(0, 14), 'day').format();

  return {
    'id': i + 1,
    'comments': generateCommentIds(),
    'filmInfo': {
      'title': film.title,
      'alternativeTitle': film.title,
      'totalRating': getRandomInteger(0, 10),
      'poster': film.poster,
      'ageRating': getRandomArrayElement(AGE_RATING),
      'director': getRandomArrayElement(NAMES),
      'writers': getRandomArrayElements(NAMES),
      'actors': getRandomArrayElements(NAMES),
      'release': {
        'date': releaseDate,
        'releaseCountry': getRandomArrayElement(COUNTRIES),
      },
      'runtime': getRandomInteger(45, 120),
      'genre': getRandomArrayElements(GENRE),
      'description': film.description,
    },
    'userDetails': {
      'watchlist': Boolean(getRandomInteger(0, 1)),
      'alreadyWatched': Boolean(getRandomInteger(0, 1)),
      'watchingDate': watchingDate,
      'favorite': Boolean(getRandomInteger(0, 1)),
    },
  };
};
