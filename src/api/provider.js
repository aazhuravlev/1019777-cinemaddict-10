import Movie from "../models/movie.js";
import Comment from "../models/comment.js";
import nanoid from 'nanoid';
import {getRandomArrayItem} from "../utils/common.js";
import {NAMES} from "../constants.js";

const getSyncedFilms = (items) => items.filter(({success}) => success).map(({payload}) => payload.film);

export default class Provider {
  constructor(api, storeMovies, storeComments) {
    this._api = api;
    this._storeMovies = storeMovies;
    this._storeComments = storeComments;
    this._isSynchronized = true;
  }

  getFilms() {
    if (this._isOnLine()) {
      return this._api.getFilms().then(
          (films) => {
            films.forEach((film) => {
              this._storeMovies.setItem(film.id, film.toRAW());
            });
            return films;
          }
      );
    }
    this._isSynchronized = false;

    const storeFilms = Object.values(this._storeMovies.getAll());

    return Promise.resolve(Movie.parseMovies(storeFilms));
  }

  getComments(id) {
    if (this._isOnLine()) {
      return this._api.getComments(id)
        .then((comments) => {
          this._storeComments.setItem(id, comments);
          return comments;
        });
    }
    this._isSynchronized = false;

    const storeFilmComments = this._storeComments.getAll()[id];

    return Promise.resolve(Comment.parseComments(storeFilmComments));
  }

  addComment(id, comment) {
    if (this._isOnLine()) {
      return this._api.addComment(id, comment);
    }
    this._isSynchronized = false;


    return Promise.resolve(comment);
  }

  updateFilm(id, film) {
    if (this._isOnLine()) {
      return this._api.updateFilm(id, film).then(
          (newFilm) => {
            this._storeMovies.setItem(newFilm.id, newFilm.toRAW());
            return newFilm;
          }
      );
    }
    this._isSynchronized = false;

    const fakeUpdatedFilm = Movie.parseMovie(Object.assign({}, film.toRAW()));

    this._storeMovies.setItem(id, Object.assign({}, fakeUpdatedFilm.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedFilm);
  }

  addComment(id, comment) {
    if (this._isOnLine()) {
      return this._api.addComment(id, comment)
        .then((comments) => {
          this._storeMovies.setComments(id, comments, `storeMovies`);
          this._storeComments.setComments(id, comments);

          return Movie.parseMovie(this._storeMovies.getAll()[id]);
        });
    }
    this._isSynchronized = false;

    const fakeNewCommentId = nanoid();
    const fakeNewCommentAuthor = getRandomArrayItem(NAMES);

    const newComment = comment;
    newComment.id = fakeNewCommentId;
    newComment.author = fakeNewCommentAuthor;

    const comments = this._storeComments.getAll()[id];
    comments.push(newComment);

    this._storeMovies.setComments(id, comments, `storeMovies`);
    this._storeComments.setComments(id, comments);

    return Promise.resolve(Movie.parseMovie(this._storeMovies.getAll()[id]));
  }

  deleteComment(dataId, commentId) {
    if (this._isOnLine()) {
      return this._api.deleteComment(commentId).then(
          () => {
            this._storeComments.removeComment(dataId, commentId);
            this._storeMovies.removeComment(dataId, commentId, `storeMovies`);
          }
      );
    }
    this._isSynchronized = false;

    this._storeComments.removeComment(dataId, commentId);
    this._storeMovies.removeComment(dataId, commentId, `storeMovies`);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeMovies = Object.values(this._storeMovies.getAll());
console.log(storeMovies)
      return this._api.sync(storeMovies)
        .then((response) => {
          console.log(response)
          // Удаляем из хранилища задачи, что были созданы
          // или изменены в оффлайне. Они нам больше не нужны
          storeMovies.filter((movie) => movie.offline).forEach((movie) => {
            console.log(movie)
            this._storeMovies.removeItem(movie.id);
          });

          // Забираем из ответа синхронизированные задачи
          const createdFilms = getSyncedFilms(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент,
          // вдруг сеть пропадёт
          [...createdFilms, ...updatedFilms].forEach((movie) => {
            this._storeMovies.setItem(movie.id, movie);
          });

          // Помечаем, что всё синхронизировано
          this._isSynchronized = true;

          return Promise.resolve();
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
