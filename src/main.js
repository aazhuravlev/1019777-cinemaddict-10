import ProfileStatusComponent from './components/profile-status.js';
import FilterComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';
import FilmCardComponent from './components/film-card.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import ExtraListComponent from './components/extra-list.js';
import FilmPopupComponent from './components/film-popup.js';
import {generateFilters, generateFilmCardsData} from './mock.js';

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

let start = -1;
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
  }};

const createHtmlFragment = (data, count) => {
  const fragment = document.createDocumentFragment();
  if (count === `count`) {
    data.forEach((card) => {
      start += 1;
      fragment.appendChild(new FilmCardComponent(card, start).getElement());
    });
  } else {
    data.forEach((card, i) => {
      fragment.appendChild(new FilmCardComponent(card, i).getElement());
    });
  }
  return fragment;
};

const sortingFilms = (type) => {
  const data = cardsData.slice();
  data.sort((a, b) => {
    return b[type] - a[type];
  });
  if (data[0][type] === 0) {
    return ``;
  }
  return data;
};

const renderExtraFilmCard = (data, node) => {
  const fragment = createHtmlFragment(data);
  console.log(fragment)
  renderHtmlPart(node.querySelector(`.films-list__container`), fragment, RenderPosition.BEFOREEND);
};

const renderFilmListExtra = (node) => {
  const ratingSortedFilms = sortingFilms(`rating`).slice(0, Count.EXTRA_FILMS);
  const commentsSortedFilms = sortingFilms(`comments`).slice(0, Count.EXTRA_FILMS);
  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
  filmListsExtra = node.querySelectorAll(`.films-list--extra`);
  renderExtraFilmCard(ratingSortedFilms, filmListsExtra[0]);
  renderExtraFilmCard(commentsSortedFilms, filmListsExtra[1]);
  let firstFilmCard = filmListsExtra[0].querySelector(`.film-card__rating`);
  if (firstFilmCard.textContent === `0`) {
    filmListsExtra[0].remove();
  }
  firstFilmCard = filmListsExtra[1].querySelector(`.film-card__comments`);
  if (firstFilmCard.textContent === `0 comments`) {
    filmListsExtra[1].remove();
  }
};

const loadMoreButtonClickHandler = (node, btn) => {
  let showingTasksCount = Count.SHOWING_CARDS_ON_START;
  return () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += Count.SHOWING_CARDS_BY_BUTTON;

    const unrenderedCards = cardsData.slice(prevTasksCount, showingTasksCount);
    renderHtmlPart(node, createHtmlFragment(unrenderedCards, `count`), RenderPosition.BEFOREEND);

    if (showingTasksCount >= cardsData.length) {
      btn.remove();
    }
  };
};

const getCardClickHandler = (data) => {
  return (evt) => {
    const idx = evt.target.getAttribute(`data-id`) || evt.target.parentNode.getAttribute(`data-id`);
    if (idx) {
      renderHtmlPart(Nodes.BODY, new FilmPopupComponent(data[idx]).getElement(), RenderPosition.BEFOREEND);
      popup = document.querySelector(`.film-details`);
      closePopupBtn = document.querySelector(`.film-details__close-btn`);
      closePopupBtn.addEventListener(`click`, removePopupCkickHandler);
      document.addEventListener(`keydown`, removePopupKeydownHandler);
    }
  };
};

const popupRemove = () => {
  if (popup) {
    popup.remove();
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

const pasteElements = () => {
  renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(cardsData.length).getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(Nodes.MAIN, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(Nodes.MAIN, new SortingComponent().getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(Nodes.MAIN, new FilmListComponent().getElement(), RenderPosition.BEFOREEND);

  const filmsContainer = Nodes.MAIN.querySelector(`.films`);
  const filmsList = Nodes.MAIN.querySelector(`.films-list`);
  const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);

  const cardsOnStart = cardsData.slice(0, Count.SHOWING_CARDS_ON_START);
  renderHtmlPart(filmsListContainer, createHtmlFragment(cardsOnStart, RenderPosition.BEFOREEND));
  renderHtmlPart(filmsList, new ShowMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);
  renderHtmlPart(filmsContainer, new ExtraListComponent().getElement(), RenderPosition.BEFOREEND);
  renderFilmListExtra(filmsContainer);

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, loadMoreButtonClickHandler(filmsListContainer, loadMoreButton));
  filmsList.addEventListener(`click`, getCardClickHandler(cardsData));
  filmListsExtra[0].addEventListener(`click`, getCardClickHandler(sortingFilms(`rating`)));
  filmListsExtra[1].addEventListener(`click`, getCardClickHandler(sortingFilms(`comments`)));
};

pasteElements();
