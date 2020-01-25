import moment from 'moment';
import he from 'he';
import AbstractSmartComponent from './abstract-smart-component.js';
import MovieModel from '../models/movie';
import {pluralize, calculateRunTime, bindAll, sortFilms} from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const POPUP_RATING_LENGTH = 9;
const Color = {
  ERROR: `red`,
  DISABLED: `#999`,
  BG_COMMENT_AREA: `#f6f6f6`,
  BORDER_COMMENT_AREA: `#979797`,
  RATING_LABEL: `#d8d8d8`
};

const generateFilmsDetailsRow = (filmsDetailsRow) => {
  return Object.entries(filmsDetailsRow).map(([key, name]) => {
    return `
      <tr class="film-details__row">
        <td class="film-details__term">${key}</td>
        <td class="film-details__cell">${name}</td>
      </tr>
    `;
  }).join(`\n`);
};

const generateFilmDetailsControls = (filmDetailsControls) => {
  return Object.entries(filmDetailsControls).map(([key, name]) => {
    const loweKey = key.toLowerCase();
    return `
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${loweKey}" name="${loweKey}"${name[1] ? ` checked` : ``}>
    <label for="${loweKey}" class="film-details__control-label film-details__control-label--${loweKey}">${name[0]}</label>
    `;
  }).join(`\n`);
};

const generateRating = (userRating) => {
  const userRatingMenu = [];
  for (let i = 1; i <= POPUP_RATING_LENGTH; i++) {
    userRatingMenu.push(
        `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}"${Number(userRating) === (i) ? ` checked` : ``}>
         <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`
    );
  }
  return userRatingMenu.join(`\n`);
};

const generateSelfFilmRating = (isWatched, title, poster, userRating) => {
  if (!isWatched) {
    return ``;
  }
  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${generateRating(userRating)}
            </div>
          </section>
        </div>
      </section>
    </div>`
  );
};

const generateGenres = (genres) => {
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
};

const generateActors = (actors) => {
  return actors.map((actor, index) => {
    return index !== 0 ? ` ${actor}` : `${actor}`;
  });
};

const generateUserRatingLabel = (isWatched, userRating) => {
  if (isWatched && userRating > 0) {
    return `<p class="film-details__user-rating">Your rate ${userRating}</p>`;
  }
  return ``;
};

const generateComment = (comments) => {
  const sortedComments = sortFilms(comments, `date`, `reverse`)

  return sortedComments.map((comment) => {
    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }).join(`\n`);
};

const objKeysUppercaseFirstLetter = (obj) => {
  const newObj = {};
  Object.entries(obj).map(([key, property]) => {
    let lowerKey = key[0].toUpperCase() + key.slice(1).toLowerCase();
    if (key.includes(`_`)) {
      const splitedKey = key.split(`_`);
      const firstPart = splitedKey[0];
      const secondPart = splitedKey[1];
      lowerKey = `${firstPart[0].toUpperCase() + firstPart.slice(1).toLowerCase()} ${secondPart[0].toUpperCase() + secondPart.slice(1).toLowerCase()}`;
    }
    newObj[lowerKey] = property;
  });
  return newObj;
};

const createFilmPopupTemplate = (data) => {
  const {title, alternativeTitle, poster, totalRating, ageRating, runtime, genre, description, comments, director, writers, actors, releaseDate, releaseCountry, isWatchlist, isWatched, isFavorite, personalRating, userEmoji} = data;

  const FilmsDetailsRow = {
    'DIRECTOR': director,
    'WRITERS': writers,
    'ACTORS': generateActors(actors),
    'RELEASE_DATE': moment(releaseDate).format(`D MMMM YYYY`),
    'RUNTIME': calculateRunTime(runtime),
    'COUNTRY': releaseCountry
  };
  const popupFilmsDetailsRow = objKeysUppercaseFirstLetter(FilmsDetailsRow);

  const FilmDetailsControls = {
    WATCHLIST: [`Add to watchlist`, isWatchlist],
    WATCHED: [`Already watched`, isWatched],
    FAVORITE: [`Add to favorites`, isFavorite]
  };

  return (
    `<form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
                ${generateUserRatingLabel(isWatched, personalRating)}
              </div>
            </div>

            <table class="film-details__table">
              ${generateFilmsDetailsRow(popupFilmsDetailsRow)}
              <tr class="film-details__row">
                <td class="film-details__term">${pluralize(genre.length, `Genre`)}</td>
                <td class="film-details__cell">
                  ${generateGenres(genre)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          ${generateFilmDetailsControls(FilmDetailsControls)}
        </section>
      </div>

      ${generateSelfFilmRating(isWatched, title, poster, personalRating)}

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          ${comments.length > 0 ? `<ul class="film-details__comments-list">${generateComment(comments)}</ul>` : ``}
          <ul class="film-details__comments-list"></ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
              ${userEmoji ? `<img src="images/emoji/${userEmoji}.png" width="55" height="55" alt="emoji">` : ``}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping"${userEmoji === `smile` ? ` checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face"${userEmoji === `sleeping` ? ` checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="grinning"${userEmoji === `puke` ? ` checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning"${userEmoji === `angry` ? ` checked` : ``}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>`
  );
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(data, onDataChange) {
    super();
    this._data = data;
    this._onDataChange = onDataChange;

    this.clickedRatingIcon = null;

    this._handler = null;

    bindAll(this, [`recoverListeners`, `_subscribeOnEvents`, `watchlistControlClickHandler`, `favoriteControlClickHandler`, `watchedControlClickHandler`, `userRatingScoreClickHandler`, `userRatingScoreResetClickHandler`, `emojiClickHandler`, `commentChangeHandler`, `deleteClickHandler`]);
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  recoverListeners() {
    this._subscribeOnEvents();
  }

  getData() {
    return this._data;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this.watchlistControlClickHandler);

    element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this.watchedControlClickHandler);

    if (element.querySelector(`.film-details__user-rating-score`)) {
      element.querySelector(`.film-details__user-rating-score`)
        .addEventListener(`click`, this.userRatingScoreClickHandler);
      element.querySelector(`.film-details__watched-reset`)
        .addEventListener(`click`, this.userRatingScoreResetClickHandler);
    }

    element.querySelector(`.film-details__emoji-list`)
    .addEventListener(`click`, this.emojiClickHandler);

    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this.favoriteControlClickHandler);

    element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._handler);

    element.querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this.commentChangeHandler);

    element.querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, this.deleteClickHandler);
  }

  setClickHandler(handler) {
    this._handler = handler;
    this.getElement().querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    delete this._data.userEmoji;
    delete this._data.userComment;
    this.getElement().querySelector(`.film-details__close-btn`)
    .removeEventListener(`click`, handler);
  }

  deleteClickHandler(evt) {
    evt.preventDefault();
    let commentId;
    if (evt.target.tagName === `BUTTON`) {
      const commentText = evt.target.closest(`.film-details__comment`).querySelector(`.film-details__comment-text`).textContent;
      const newFilm = MovieModel.clone(this._data);

      this._data.comments.forEach((comment) => {

        if (comment.comment === commentText) {
          const index = this._data.comments.indexOf(comment);
          this._data.comments = [].concat(this._data.comments.slice(0, index), this._data.comments.slice(index + 1));
          commentId = newFilm.comments[index];
        }
      });
      this._onDataChange(this._data, newFilm, this, null, commentId, this._data);
    }
  }

  commentChangeHandler() {
    const commentArea = this.getElement().querySelector(`.film-details__comment-input`);
    this._data.userComment = he.encode(commentArea.value);
  }

  watchlistControlClickHandler() {
    const newFilm = MovieModel.clone(this._data);
    newFilm.isWatchlist = !newFilm.isWatchlist;

    this._onDataChange(this._data, newFilm, this);
  }

  favoriteControlClickHandler() {
    const newFilm = MovieModel.clone(this._data);
    newFilm.isFavorite = !newFilm.isFavorite;

    this._onDataChange(this._data, newFilm, this);
  }

  watchedControlClickHandler() {
    const newFilm = MovieModel.clone(this._data);
    newFilm.isWatched = !newFilm.isWatched;

    newFilm.personalRating = 0;
    newFilm.watchingDate = newFilm.isWatched ? new Date() : newFilm.watchingDate;

    this._onDataChange(this._data, newFilm, this);
  }

  userRatingScoreClickHandler(evt) {
    if (evt.target.tagName === `LABEL`) {
      this.clickedRatingIcon = evt.target;
    }
    if (evt.target.tagName === `INPUT`) {
      const newFilm = MovieModel.clone(this._data);
      newFilm.personalRating = Number(evt.target.value);

      this.addRatingStyles();

      this._onDataChange(this._data, newFilm, this);
    }
  }

  userRatingScoreResetClickHandler() {
    const newFilm = MovieModel.clone(this._data);
    newFilm.personalRating = 0;

    this._onDataChange(this._data, newFilm, this);
  }

  emojiClickHandler(evt) {
    if (evt.target.tagName === `INPUT` || evt.target.parentNode.tagName === `INPUT`) {
      this._data.userEmoji = evt.target.id.slice(6);
      this.rerender();
    }
  }

  shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    element.style.border = Color.ERROR;

    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  addRatingStyles() {
    const ratingIcons = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    this.getElement().querySelector(`.film-details__watched-reset`).disabled = true;
    ratingIcons.forEach((icon) => {
      if (icon.checked !== true) {
        icon.labels[0].style.backgroundColor = Color.DISABLED;
      }

      icon.disabled = true;
    });
  }

  removeRatingStyles() {
    const ratingIcons = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    this.getElement().querySelector(`.film-details__watched-reset`).disabled = false;
    ratingIcons.forEach((icon) => {
      if (icon.labels[0] !== this.clickedRatingIcon) {
        icon.labels[0].style.backgroundColor = Color.RATING_LABEL;
      }

      icon.disabled = false;
    });
    this.clickedRatingIcon.style.backgroundColor = Color.ERROR;
    this.clickedRatingIcon = null;
  }

  addCommentStyles() {
    const popupCommentArea = this.getElement().querySelector(`.film-details__comment-input`);
    const emotionsIcons = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    popupCommentArea.style.borderColor = Color.BORDER_COMMENT_AREA;
    popupCommentArea.readOnly = true;
    popupCommentArea.style.backgroundColor = Color.DISABLED;
    emotionsIcons.forEach((icon) => {
      icon.disabled = true;
    });
  }

  removeCommentStyles() {
    const popupCommentArea = this.getElement().querySelector(`.film-details__comment-input`);
    const emotionsIcons = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    popupCommentArea.readOnly = false;
    popupCommentArea.style.backgroundColor = Color.BG_COMMENT_AREA;
    emotionsIcons.forEach((icon) => {
      icon.disabled = false;
    });
    popupCommentArea.style.borderColor = Color.ERROR;
  }
}
