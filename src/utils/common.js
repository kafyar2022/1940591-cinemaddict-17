const getRandomInteger = (min = 1, max = 10000) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));

  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const generateRandomId = (min = 1, max = 10000) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      // eslint-disable-next-line no-console
      console.error(`Перебраны все числа из диапазона от ${min} до ${max}`);
      return 0;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getUniqueRandomArrayElement = (array) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomArrayElement(array);
    if (previousValues.length >= array.length) {
      // eslint-disable-next-line no-console
      console.error(`Перебраны все элементы из массива ${array}`);
      return '';
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomArrayElement(array);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const getRandomArrayElements = (array) => Array.from({ length: getRandomInteger(1, array.length) }, getUniqueRandomArrayElement(array));

export {
  getRandomInteger,
  generateRandomId,
  getRandomArrayElement,
  getUniqueRandomArrayElement,
  getRandomArrayElements,
};
