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

const ESC_KEYCODE = 27;

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

const renderExtraFilmCard = (data, node) => {
  data.slice(0, Count.EXTRA_FILMS).forEach((card, i) => {
    renderHtmlPart(node.querySelector(`.films-list__container`), createFilmCardTemplate(card, i), `beforeend`);
  });
};

const renderFilmListExtra = (node) => {
  Nodes.FOOTER_STATISTIC.textContent = `${cardsData.length} movies inside`;
  filmListsExtra = node.querySelectorAll(`.films-list--extra`);
  renderExtraFilmCard(sortingFilmsRating(), filmListsExtra[0]);
  renderExtraFilmCard(sortingFilmsComments(), filmListsExtra[1]);
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
    showingTasksCount = showingTasksCount + Count.SHOWING_CARDS_BY_BUTTON;

    cardsData.slice(prevTasksCount, showingTasksCount)
      .forEach((card) => {
        renderHtmlPart(node, createFilmCardTemplate(card, (start += 1)), `beforeend`);
      });

    if (showingTasksCount >= cardsData.length) {
      btn.remove();
    }
  };
};

const cardClickHandler = (data) => {
  return (evt) => {
    const idx = evt.target.getAttribute(`data-id`) || evt.target.parentNode.getAttribute(`data-id`);
    if (idx) {
      renderHtmlPart(Nodes.BODY, createFilmPopupTemplate(data[idx]), `beforeend`);
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
  if (evt.keyCode === ESC_KEYCODE) {
    popupRemove();
  }
};

const pasteElements = () => {
  renderHtmlPart(Nodes.HEADER, createProfileStatusTemplate(cardsData.length), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilterTemplate(filters), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createSortingTemplate(), `beforeend`);
  renderHtmlPart(Nodes.MAIN, createFilmListTemplate(), `beforeend`);

  const filmsContainer = Nodes.MAIN.querySelector(`.films`);
  const filmsList = Nodes.MAIN.querySelector(`.films-list`);
  const filmsListContainer = Nodes.MAIN.querySelector(`.films-list__container`);

  cardsData.slice(0, Count.SHOWING_CARDS_ON_START).forEach((card) => renderHtmlPart(filmsListContainer, createFilmCardTemplate(card, (start += 1)), `beforeend`));

  renderHtmlPart(filmsList, createShowMoreButtonTemplate(), `beforeend`);

  renderHtmlPart(filmsContainer, createExtraListTemplate(), `beforeend`);

  renderFilmListExtra(filmsContainer);

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, loadMoreButtonClickHandler(filmsListContainer, loadMoreButton));
  filmsList.addEventListener(`click`, cardClickHandler(cardsData));
  filmListsExtra[0].addEventListener(`click`, cardClickHandler(sortingFilmsRating()));
  filmListsExtra[1].addEventListener(`click`, cardClickHandler(sortingFilmsComments()));
};

pasteElements();
