import FilterComponent from '../components/filter.js';
import {FilterName} from '../constants.js';
import {renderHtmlPart, RenderPosition, replace} from '../utils/render.js';
import {bindAll, mapEntries} from '../utils/common.js';
import {getFilmsByFilter} from '../utils/filter.js';

const Handler = {
  onDataChange: `_onDataChange`,
  onFilterChange: `_onFilterChange`,
  getFiltersProperties: `_getFiltersProperties`
};

export default class FilterController {
  constructor(container, movieModel, showStatisticHandler) {
    this._container = container;
    this._movieModel = movieModel;
    this._showStatisticHandler = showStatisticHandler;

    bindAll(this, [Handler.onDataChange, Handler.onFilterChange, Handler.getFiltersProperties]);

    this._activeFilterName = FilterName.ALL;
    this._filtersPropertires = mapEntries(FilterName, this._getFiltersProperties);
    this._filterComponent = null;

    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(this._filtersPropertires);

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    this._filterComponent.setShowStatisticHandler(this._showStatisticHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderHtmlPart(this._container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterName) {
    this._movieModel.setFilter(filterName);
    this._activeFilterName = filterName;

    this._filtersPropertires = mapEntries(FilterName, this._getFiltersProperties);
    this.render();
  }

  _getFiltersProperties([link, filterName]) {
    return {
      name: filterName,
      link,
      count: getFilmsByFilter(this._movieModel.getMoviesAll(), filterName).length,
      isActive: filterName.split(` `)[0] === this._activeFilterName.split(` `)[0],
    };
  }

  _onDataChange() {
    this.render();
  }
}
