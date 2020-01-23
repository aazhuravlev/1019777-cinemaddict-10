import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {Nodes, RenderPosition} from './constants.js';
import {renderHtmlPart} from './utils/render.js';
import ProfileStatusComponent from './components/profile-status.js';
import FilterController from './controllers/filter.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import PageController from './controllers/page-controller.js';

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic dXNlckBwYZFad28yAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const mainNavigationAdditionalItemClassName = `main-navigation__item--additional`;

const showStatisticHandler = (pageController, statisticsComponent) => {
  return (evt) => {
    if (evt.target.className.includes(mainNavigationAdditionalItemClassName)) {
      pageController.hide();
      statisticsComponent.show();
    } else {
      pageController.show();
      statisticsComponent.hide();
    }
  };
};

const moviesModel = new MoviesModel();

const pasteElements = () => {
  const api = new Api(END_POINT, AUTHORIZATION);
  const store = new Store(STORE_NAME, window.localStorage);
  const apiWithProvider = new Provider(api, store);

  apiWithProvider.getFilms()
    .then((films) => {
      moviesModel.setMovies(films);
      const filmListComponent = new FilmListComponent(moviesModel.getMoviesAll());
      const pageController = new PageController(filmListComponent, moviesModel, apiWithProvider);
      const statisticsComponent = new StatisticsComponent(moviesModel);

      renderHtmlPart(Nodes.HEADER, new ProfileStatusComponent(moviesModel.getMoviesAll().length).getElement(), RenderPosition.BEFOREEND);

      const filterController = new FilterController(Nodes.MAIN, moviesModel, showStatisticHandler(pageController, statisticsComponent));
      filterController.render();

      renderHtmlPart(filmListComponent.getElement().querySelector(`.films-list`), new FilmListTitleComponent(moviesModel.getMoviesAll()).getElement(), RenderPosition.AFTERBEGIN);
      renderHtmlPart(Nodes.MAIN, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
      statisticsComponent.hide();
      Nodes.FOOTER_STATISTIC.textContent = `${moviesModel.getMoviesAll().length} movies inside`;

      const arrayOfPromises = films.map((film) => apiWithProvider.getComments(film[`id`]).then((comments) => comments));
      Promise.all(arrayOfPromises).then((comments) => {
        moviesModel.setComments(comments);
        pageController.render();
      });
    });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);

    if (!apiWithProvider.getSynchronize()) {
      apiWithProvider.sync()
        .then(() => {
          // Действие, в случае успешной синхронизации
        })
        .catch(() => {
          // Действие, в случае ошибки синхронизации
        });
    }
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
};

pasteElements();
