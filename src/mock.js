const FILTER_NAMES = [
  `All movies`, `Watchlist`, `History`, `Favorites`, `Stats`
];
const SENTENCE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const FILMS = [`The Shawshank Redemption`, `The Godfather`, `The Dark Knight`, `Schindler's List`, `The Lord of the Rings: The Return of the King`, `Pulp Fiction`, `Fight Club`, `Forrest Gump`, `Inception`, `Matrix`, `Goodfellas`, `Se7en`, `Star Wars`, `Sen to Chihiro no kamikakushi`, `Interstellar`];
const IMAGES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const FILTER_MAX_VALUE = 20;

const Confines = function (min, max) {
  this.min = min;
  this.max = max;
}

const Rating = new Confines(0, 10);
const Year = new Confines(1900, 2019);
const Hour = new Confines(0, 3);
const Minutes = new Confines(0, 59);
const Comments = new Confines(0, 100);
const SentencesQuantity = new Confines(1, 3);

const GENRES = [`Action`, `Adventure`, `Comedy`, `Drama`, `Crime`, `Horror`, `Fantasy`, `Western`, `Thriller`, `Animation`];

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomBetween = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
}

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomRating = (min, max) => {
  return Math.round(Math.random() * (max - min) + min) + Number(Math.random().toFixed(1));
};

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      link: it.slice(0, it.includes(' ') ? it.indexOf(' ') : it.length).toLowerCase(),
      count: it.includes(FILTER_NAMES[0]) ? `` : it.includes(FILTER_NAMES[4]) ? `` : Math.floor(Math.random() * FILTER_MAX_VALUE)
    };
  });
};

const generateDescription = (sentence, quantity) => {
  const sentencesArray = sentence.split('.');
  let title = [];
  for (let i = 0; i < quantity; i++) {
    title.push(getRandomArrayItem(sentencesArray));
  }
  title = title.join(`. `);
  return title;
};

const generateFilmCardData = () => {
  return {
    title: getRandomArrayItem(FILMS),
    image: getRandomArrayItem(IMAGES),
    rating: getRandomRating(Rating.min, Rating.max),
    year: getRandomBetween(Year.min, Year.max),
    time: `${getRandomBetween(Hour.min, Hour.max)}h ${getRandomBetween(Minutes.min, Minutes.max)}m`,
    genre: getRandomArrayItem(GENRES),
    description: generateDescription(SENTENCE, getRandomBetween(SentencesQuantity.min, SentencesQuantity.max)),
    comments: getRandomBetween(Comments.min, Comments.max)
  }
};

const generateFilmCardsData = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCardData);
};

export {generateFilters, generateFilmCardsData};
