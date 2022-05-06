import dayjs from 'dayjs';
import { COUNTRIES, FILMS, FILMS_QUANTITY, GENRE, NAMES } from '../const.js';
import { generateRandomId, getRandomArrayElement, getRandomArrayElements, getRandomInteger } from '../util.js';

const generateId = generateRandomId(1, FILMS_QUANTITY);

const generateCommentId = generateRandomId(1, 1000000);
const generateCommentIds = () => Array.from({ length: getRandomInteger(0, 100) }, generateCommentId);

export const generateFilm = () => {
  const film = getRandomArrayElement(FILMS);
  const releaseDate = dayjs().add(getRandomInteger(1, 90), 'day').format();
  const watchingDate = dayjs(releaseDate).add(getRandomInteger(0, 14), 'day').format();

  return {
    'id': generateId(),
    'comments': generateCommentIds(),
    'filmInfo': {
      'title': film.title,
      'alternativeTitle': film.title,
      'totalRating': '.',
      'poster': film.poster,
      'ageRating': getRandomInteger(0, 10),
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
