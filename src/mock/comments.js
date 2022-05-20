import dayjs from 'dayjs';
import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';

const names = ['Tom Ford', 'David Lynch', 'Martin Scorsese', 'Joel and Ethan Coen', 'Steven Soderbergh', 'Terrence Malick', 'Jack Nicholson', 'Marlon Brando', 'Denzel Washington', 'Katharine Hepburn', 'Humphrey Bogart'];
const comments = ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?'];
const emotions = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = (_, i) => ({
  id: i + 1,
  author: getRandomArrayElement(names),
  comment: getRandomArrayElement(comments),
  date: dayjs().add(getRandomInteger(1, 9), 'day').format(),
  emotion: getRandomArrayElement(emotions),
});
