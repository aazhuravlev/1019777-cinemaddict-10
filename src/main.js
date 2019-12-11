import ProfileStatusComponent from './components/profile-status.js';
import FilterComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';
import FilmCardComponent from './components/film-card.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import ExtraListComponent from './components/extra-list.js';
import FilmPopupComponent from './components/film-popup.js';
import {
  generateFilters,
  generateFilmCardsData
} from './mock.js';

const ExtraTitles = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`
};

const TypeOfSorting = {
  rating: `rating`,
  comments: `comments`
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const Count = {
  CARD: 29,
  SHOWING_CARDS_ON_START: 5,
  SHOWING_CARDS_BY_BUTTON: 5,
  EXTRA: 2,
  EXTRA_FILMS: 2
};

const KeyCode = {
  ESC: 27
};

let popup;
let filmListsExtra;
let closePopupBtn;

const cardsData = generateFilmCardsData(Count.CARD);

const Nodes = {
  BODY: document.querySelector(`body`),
  HEADER: document.querySelector(`.header`),
  MAIN: document.querySelector(`.main`),
  FOOTER_STATISTIC: document.querySelector(`.footer__statistics p`)
};

const filters = generateFilters();

const renderHtmlPart = (container, template, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;
    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
  }
};

const createFilmCardFragment = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((card) => {
    const filmCardElement = new FilmCardComponent(card);
    const filmPopupElement = new FilmPopupComponent(card);
    const filmTitle = filmCardElement.getElement().querySelector(`h3`);
    const filmImage = filmCardElement.getElement().querySelector(`img`);
    const filmComments = filmCardElement.getElement().querySelector(`a`);
    const getCardClickHandler = (evt) => {

      if ([filmTitle, filmImage, filmComments].includes(evt.target)) {
        renderHtmlPart(Nodes.BODY, filmPopupElement.getElement(), RenderPosition.BEFOREEND);
        popup = document.querySelector(`.film-details`);
        closePopupBtn = filmPopupElement.getElement().querySelector(`.film-details__close-btn`);
        closePopupBtn.addEventListener(`click`, removePopupCkickHandler);
        document.addEventListener(`keydown`, removePopupKeydownHandler);
      }
    };

    const popupRemove = () => {
      if (filmPopupElement.getElement()) {
        filmPopupElement.getElement().remove();
        filmPopupElement.removeElement();
        closePopupBtn.removeEventListener(`click`, removePopupCkickHandler);
        document.removeEventListener(`keydown`, removePopupKeydownHandler);
      }
    };

    const removePopupCkickHandler = () => {
      popupRemove();
    };

    const removePopupKeydownHandler = (evt) => {
      if (evt.keyCode === KeyCode.ESC) {
        popupRemove();
      }
    };
    filmCardElement.getElement().addEventListener(`click`, getCardClickHandler);

    fragment.appendChild(filmCardElement.getElement());
  });
  return fragment;
};

const sortingFilms = (type) => {
  const data = cardsData.slice();
  data.sort((a, b) => {
    return b[type] - a[type];
  });
  return data;
};

const renderExtraFilmCard = (data, node) => {
  renderHtmlPart(node.querySelector(`.films-list__container`), createFilmCardFragment(data), RenderPosition.BEFOREEND);
};

const renderFilmListExtra = (node) => {
  const ratingSortedFilms = sortingFilms(TypeOfSorting.rating).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortingFilms(TypeOfSorting.comments).slice(0, Count.EXTRA_FILMS);

  const isFilmsUnRated = ratingSortedFilms.every((film) => film.rating === 0);
  const isFilmsUnComment = ratingSortedFilms.every((comment) => comment.comments === 0);

  filmListsExtra = node.querySelectorAll(`.films-list--extra`);
  if (isFilmsUnRated) {
    filmListsExtra[0].remove();
  } else {
    renderExtraFilmCard(ratingSortedFilms, filmListsExtra[0]);
  }
  if (isFilmsUnComment) {
    filmListsExtra[1].remove();
  } else {
    renderExtraFilmCard(commentsSortedFilms, filmListsExtra[1]);
  }
};

const loadMoreButtonClickHandler = (node, btn) => {
  let showingTasksCount = Count.SHOWING_CARDS_ON_START;
  return () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += Count.SHOWING_CARDS_BY_BUTTON;

    const unrenderedCards = cardsData.slice(prevTasksCount, showingTasksCount);

    renderHtmlPart(node, createFilmCardFragment(unrenderedCards), RenderPosition.BEFOREEND);

    if (showingTasksCount >= cardsData.length) {
      btn.remove();
    }
  };
};

const createFragment = (arr) => {
  const fragment = document.createDocumentFragment();
  for (const element of arr) {
    fragment.appendChild(element);
  }
  return fragment;
};

const pasteElements = () => {
  renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(cardsData.length).getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(Nodes.MAIN, createFragment([new FilterComponent(filters).getElement(), new SortingComponent().getElement(), new FilmListComponent().getElement()]), RenderPosition.BEFOREEND);

  const filmsContainer = Nodes.MAIN.querySelector(`.films`);
  const filmsList = Nodes.MAIN.querySelector(`.films-list`);
  const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);

  const cardsOnStart = cardsData.slice(0, Count.SHOWING_CARDS_ON_START);

  renderHtmlPart(filmsListContainer, createFilmCardFragment(cardsOnStart), RenderPosition.BEFOREEND);

  renderHtmlPart(filmsList, new ShowMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(filmsContainer, createFragment([new ExtraListComponent(ExtraTitles.TOP_RATED).getElement(), new ExtraListComponent(ExtraTitles.MOST_COMMENTED).getElement()]), RenderPosition.BEFOREEND);
  renderFilmListExtra(filmsContainer);

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, loadMoreButtonClickHandler(filmsListContainer, loadMoreButton));
  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
};

pasteElements();
