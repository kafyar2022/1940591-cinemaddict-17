import dayjs from 'dayjs';
import { generateRandomId, getRandomArrayElement, getRandomArrayElements, getRandomInteger } from '../utils/common.js';

const genre = ['Comedy', 'Mystery', 'Drama', 'Cartoon', 'Western'];
const names = ['Tom Ford', 'David Lynch', 'Martin Scorsese', 'Joel and Ethan Coen', 'Steven Soderbergh', 'Terrence Malick', 'Jack Nicholson', 'Marlon Brando', 'Denzel Washington', 'Katharine Hepburn', 'Humphrey Bogart'];
const countries = ['Finland', 'USA', 'Russia', 'Tajikistan', 'Germany', 'France', 'Afganistan'];
const ageRating = ['0+', '6+', '14+', '18+', '24+'];
const films = [
  {
    title: 'The Dance of Life',
    poster: 'images/posters/the-dance-of-life.jpg',
    description: 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr.',
  },
  {
    title: 'Sagebrush Trail',
    poster: 'images/posters/sagebrush-trail.jpg',
    description: 'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant\'s narrow escape.',
  },
  {
    title: 'The Man with the Golden Arm',
    poster: 'images/posters/the-man-with-the-golden-arm.jpg',
    description: 'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on.',
  },
  {
    title: 'Santa Claus Conquers the Martians',
    poster: 'images/posters/santa-claus-conquers-the-martians.jpg',
    description: 'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti").',
  },
  {
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    poster: 'images/posters/popeye-meets-sinbad.png',
    description: 'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor.',
  },
  {
    title: 'The Great Flamarion',
    poster: 'images/posters/the-great-flamarion.jpg',
    description: 'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback.',
  },
  {
    title: 'Made for Each Other',
    poster: 'images/posters/made-for-each-other.png',
    description: 'John Mason (James Stewart) is a young, somewhat timid attorney in New York City. He has been doing his job well, and he has a chance of bein.',
  },
];

const generateCommentId = generateRandomId(1, 100000);
const generateCommentIds = () => Array.from({ length: getRandomInteger(0, 10) }, generateCommentId);

export const generateFilm = (_, i) => {
  const film = getRandomArrayElement(films);
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
      'ageRating': getRandomArrayElement(ageRating),
      'director': getRandomArrayElement(names),
      'writers': getRandomArrayElements(names),
      'actors': getRandomArrayElements(names),
      'release': {
        'date': releaseDate,
        'releaseCountry': getRandomArrayElement(countries),
      },
      'runtime': getRandomInteger(45, 120),
      'genre': getRandomArrayElements(genre),
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
