import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {getWatchedFilms} from '../utils/filter.js';

const getGenresData = (filmsData) => {
  const genres = [];
  const genresData = new Map();

  filmsData.forEach((film) => film.genre.forEach((it) => genres.push(it)));

  genres.forEach((it) => {
    if (genresData.has(it)) {
      const value = genresData.get(it);
      genresData.set(it, value + 1);
    } else {
      genresData.set(it, 1);
    }
  });

  return genresData;
};

const getTotalDuration = (films) => {
  const totalWatchedTime = films.map((film) => moment(film.time).format(`h:mm`).split(`:`));
  const hours = totalWatchedTime.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue[0]);
  }, 0);
  const minutes = totalWatchedTime.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue[1]);
  }, 0);
  const totalHours = hours + Math.round(minutes / 60);
  const totalMinutes = minutes % 60;
  return `${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span>`;
};

const renderChart = (ctx, watchedFilmsData) => {
  const genresData = getGenresData(watchedFilmsData);
  const sortedGenresData = new Map([...genresData].sort((a, b) => b[1] - a[1]));

  const genresLabels = [...sortedGenresData.keys()];
  const genresValues = [...sortedGenresData.values()];

  ctx.height = 50 * genresLabels.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresLabels,
      datasets: [{
        data: genresValues,
        backgroundColor: `#ffe800`,
        categoryPercentage: 0.6
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            padding: 80,
            fontColor: `#ffffff`,
            fontSize: 17
          }
        }]
      },
      plugins: {
        datalabels: {
          color: `#ffffff`,
          font: {
            size: 17
          },
          anchor: `start`,
          align: `left`,
          offset: 40,
        }
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (watchedFilms, totalDuration, topGenre) => {
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${topGenre}ghter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDuration}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(filmsData) {
    super();

    this._filmsData = filmsData.getMoviesAll();

    this.watchedFilms = getWatchedFilms(this._filmsData);
    this.genresData = getGenresData(this.watchedFilms);
    this.sortedGenresData = [...this.genresData].sort((a, b) => b[1] - a[1]);
    this.totalDuration = getTotalDuration(this.watchedFilms);
    this.topGenre = this.sortedGenresData[0][0];

    this._chart = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this.watchedFilms, this.totalDuration, this.topGenre);
  }

  show() {
    super.show();

    this.rerender(this._filmsData);
  }

  rerender(filmsData) {
    this._filmsData = filmsData;

    super.rerender();

    this._renderChart();
  }

  recoverListeners() {}

  _renderChart() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderChart(ctx, this._filmsData);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}
