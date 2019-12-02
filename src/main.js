import {createProfileStatusTemplate} from './components/profile-status.js';
import {createFilterTemplate} from './components/filter.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/film-list.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createExtraListTemplate} from './components/extra-list.js';
import {createFilmPopupTemplate} from './components/film-popup.js';
import {generateFilters, generateFilmCardsData} from './mock.js';

const Count = {
  CARD: 29,
  SHOWING_CARDS_ON_START: 5,
  SHOWING_CARDS_BY_BUTTON: 5,
  EXTRA: 2,
  EXTRA_FILMS: 2
};

const cardsData = generateFilmCardsData(Count.CARD);

const Nodes = {
  BODY: document.querySelector(`body`),
  HEADER: document.querySelector(`.header`),
  MAIN: document.querySelector(`.main`)
};

const filters = generateFilters();

const renderHtmlPart = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

/*
const renderHtmlParts = (quantity, template) => {
  const arr = [];
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < quantity; i++) {
    arr.push(template);
  }
  fragment = arr.join(``);
  return fragment;
};
*/

const sortingFilmsRating = () => {
  const data = cardsData.slice();
  data.sort((a, b) => {
    return b.rating - a.rating;
  });
  return data;
};

const sortingFilmsComments = () => {
  const data = cardsData.slice();
  data.sort((a, b) => {
    return b.comments - a.comments;
  });
  return data;
};

const renderFilmListExtra = (node) => {
  const filmListsExtra = node.querySelectorAll(`.films-list--extra`);
  sortingFilmsRating().slice(0, Count.EXTRA_FILMS).forEach((card) => renderHtmlPart(filmListsExtra[0].querySelector(`.films-list__container`), createFilmCardTemplate(card), `beforeend`));
  sortingFilmsComments().slice(0, Count.EXTRA_FILMS).forEach((card) => renderHtmlPart(filmListsExtra[1].querySelector(`.films-list__container`), createFilmCardTemplate(card), `beforeend`));
};

const pasteElements = () => {
  renderHtmlPart(Nodes.HEADER, createProfileStatusTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilterTemplate(filters), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createSortingTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilmListTemplate(), `beforeend`);

  const filmsContainer = Nodes.MAIN.querySelector(`.films`);
  const filmsList = Nodes.MAIN.querySelector(`.films-list`);
  const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);

  cardsData.slice(0, Count.SHOWING_CARDS_ON_START).forEach((card) => renderHtmlPart(filmsListContainer, createFilmCardTemplate(card), `beforeend`));

  renderHtmlPart(filmsList, createShowMoreButtonTemplate(), `beforeend`);

  renderHtmlPart(filmsContainer, createExtraListTemplate(), `beforeend`);

  renderFilmListExtra(filmsContainer);
  renderHtmlPart(Nodes.BODY, createFilmPopupTemplate(), `beforeend`);
};

pasteElements();
