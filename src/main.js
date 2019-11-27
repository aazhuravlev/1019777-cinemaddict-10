import {createProfileStatusTemplate} from './components/profile-status.js';
import {createFilterTemplate} from './components/filter.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/film-list.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createExtraListTemplate} from './components/extra-list.js';
import {createFilmPopupTemplate} from './components/film-popup.js';

const Count = {
  CARD: 5,
  EXTRA: 2,
  EXTRA_FILMS: 2
};

const Nodes = {
  BODY: document.querySelector(`body`),
  HEADER: document.querySelector(`.header`),
  MAIN: document.querySelector(`.main`)
};

const renderHtmlPart = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderHtmlParts = (quantity, template) => {
  const arr = [];
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < quantity; i++) {
    arr.push(template);
  }
  fragment = arr.join(``);
  return fragment;
};

const pasteElements = () => {
  renderHtmlPart(Nodes.HEADER, createProfileStatusTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilterTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createSortingTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilmListTemplate(), `beforeend`);

  const filmsContainer = Nodes.MAIN.querySelector(`.films`);
  const filmsList = Nodes.MAIN.querySelector(`.films-list`);
  const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);
  renderHtmlPart(filmsListContainer, renderHtmlParts(Count.CARD, createFilmCardTemplate()), `beforeend`);
  renderHtmlPart(filmsList, createShowMoreButtonTemplate(), `beforeend`);

  renderHtmlPart(filmsContainer, renderHtmlParts(Count.EXTRA, createExtraListTemplate()), `beforeend`);

  const filmListsExtra = filmsContainer.querySelectorAll(`.films-list--extra`);
  renderHtmlPart(filmListsExtra[0].querySelector(`.films-list__container`), renderHtmlParts(Count.EXTRA_FILMS, createFilmCardTemplate()), `beforeend`);
  renderHtmlPart(filmListsExtra[1].querySelector(`.films-list__container`), renderHtmlParts(Count.EXTRA_FILMS, createFilmCardTemplate()), `beforeend`);

  renderHtmlPart(Nodes.BODY, createFilmPopupTemplate(), `beforeend`);
};

pasteElements();
