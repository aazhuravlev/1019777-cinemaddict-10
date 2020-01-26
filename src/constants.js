const NAMES = [`Aaron`, `Adam`, `Aiden`, `Albert`, `Alex`, `Alexander`, `Alfie`, `Archie`, `Arthur`, `Austin`, `Benjamin`, `Blake`, `Bobby`];

const FilterName = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`
};

const FILTER_MAX_VALUE = 20;

const Nodes = {
  BODY: document.querySelector(`body`),
  HEADER: document.querySelector(`.header`),
  MAIN: document.querySelector(`.main`),
  FOOTER_STATISTIC: document.querySelector(`.footer__statistics p`)
};

const generateExceptionsFiltersCount = (item) => {
  if (item.includes(FilterName.ALL) || item.includes(FilterName.STATS)) {
    return ``;
  }
  return Math.floor(Math.random() * FILTER_MAX_VALUE);
};

const generateFilters = () => {
  return Object.values(FilterName).map((item) => {
    const itemIndexOf = item.indexOf(` `);
    const generateLink = item.slice(0, itemIndexOf !== -1 ? itemIndexOf : item.length).toLowerCase();
    return {
      name: item,
      link: generateLink,
      count: generateExceptionsFiltersCount(item)
    };
  });
};

const ExtraTitles = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`
};

const GenreIndex = {
  NAME: 0,
  VALUE: 1,
  TOP_GENRE: 0
};

const SortType = {
  DEFAULT: `default`,
  DATE: `releaseDate`,
  RATING: `totalRating`,
  COMMENTS: `comments`
};

const Count = {
  CARD: 29,
  SHOWING_CARDS_ON_START: 5,
  SHOWING_CARDS_BY_BUTTON: 5,
  EXTRA: 2,
  EXTRA_FILMS: 2
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const KeyCode = {
  ESC: 27,
  ENTER: 13
};

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const ContainerTitle = {
  CLASS: `visually-hidden`,
  TEXT_CONTENT: `All movies. Upcoming`
};

export {NAMES, GenreIndex, Nodes, generateFilters, ExtraTitles, SortType, Count, KeyCode, RenderPosition, Mode, FilterName, ContainerTitle};
