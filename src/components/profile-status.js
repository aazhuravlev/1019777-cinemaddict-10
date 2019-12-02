import {getRandomBetween} from '../util.js';

const generateUserRank = (max) => {
  const checkedMovies = getRandomBetween(0, max);
  let userRank = ``;
  if (checkedMovies >= 1 && checkedMovies < 11) {
    userRank = `Novice`;
  } else if (checkedMovies >= 11 && checkedMovies < 21) {
    userRank = `Fan`;
  } else if (checkedMovies >= 21) {
    userRank = `Movie Buff`;
  }
  return userRank;
};

const createProfileStatusTemplate = (max) => {
  const userRank = generateUserRank(max);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export {createProfileStatusTemplate};
