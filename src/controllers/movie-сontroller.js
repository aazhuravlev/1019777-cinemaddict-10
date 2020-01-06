import {Nodes, KeyCode, Mode} from '../constants.js';
import {renderHtmlPart, RenderPosition, remove} from '../utils/render.js';
import FilmCardComponent from '../components/film-card.js';
import FilmPopupComponent from '../components/film-popup.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardData = [];

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardPopupComponent = null;

    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._removePopupCkickHandler = this._removePopupCkickHandler.bind(this);
    this._removePopupKeydownHandler = this._removePopupKeydownHandler.bind(this);
    this.watchListButtonClickHandler = this.watchListButtonClickHandler.bind(this);
    this.watchedButtonClickHandler = this.watchedButtonClickHandler.bind(this);
    this.favoritesButtonClickHandler = this.favoritesButtonClickHandler.bind(this);
  }

  render(filmCardData) {
    this._cardData = filmCardData;
    this._filmCardComponent = new FilmCardComponent(this._cardData);
    this._filmCardPopupComponent = new FilmPopupComponent(this._cardData);

    this._filmCardComponent.setClickHandler(this._cardClickHandler);
    this._filmCardComponent.setWatchListButtonClickHandler(this.watchListButtonClickHandler);
    this._filmCardComponent.setWatchedButtonClickHandler(this.watchedButtonClickHandler);
    this._filmCardComponent.setFavoritesButtonClickHandler(this.favoritesButtonClickHandler);

    this._container.appendChild(this._filmCardComponent.getElement());
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupRemove();
    }
  }

  _cardClickHandler(evt) {
    const filmTitle = this._filmCardComponent.getElement().querySelector(`h3`);
    const filmImage = this._filmCardComponent.getElement().querySelector(`img`);
    const filmComments = this._filmCardComponent.getElement().querySelector(`a`);

    if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
      renderHtmlPart(Nodes.BODY, this._filmCardPopupComponent.getElement(), RenderPosition.BEFOREEND);

      this._filmCardPopupComponent.setClickHandler(this._removePopupCkickHandler);
      this._filmCardPopupComponent.recoverListeners();

      document.addEventListener(`keydown`, this._removePopupKeydownHandler);
      this._mode = Mode.POPUP;
    }
  }

  watchListButtonClickHandler(evt) {
    evt.preventDefault();
    this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
      isWatchList: !this._cardData.isWatchList,
    }));
  }

  watchedButtonClickHandler(evt) {
    evt.preventDefault();
    this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
      isWatched: !this._cardData.isWatched,
    }));
  }

  favoritesButtonClickHandler(evt) {
    evt.preventDefault();
    this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, {
      isFavorite: !this._cardData.isFavorite,
    }));
  }

  _popupRemove() {
    if (this._filmCardPopupComponent.getElement()) {
      this._filmCardPopupComponent.removeClickHandler(this._removePopupCkickHandler);
      document.removeEventListener(`keydown`, this._removePopupKeydownHandler);
      this._mode = Mode.DEFAULT;
      this._onDataChange(this, this._cardData, Object.assign({}, this._cardData, this._filmCardPopupComponent.getData()));
      remove(this._filmCardPopupComponent);
    }
  }

  _removePopupCkickHandler() {
    this._popupRemove();
  }

  _removePopupKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      this._popupRemove();
    }
  }
}
