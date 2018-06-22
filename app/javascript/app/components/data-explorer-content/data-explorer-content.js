import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { PureComponent, createElement } from 'react';
import { getLocationParamUpdated } from 'utils/navigation';
import { PropTypes } from 'prop-types';
import qs from 'query-string';
import {
  DATA_EXPLORER_FIRST_COLUMN_HEADERS,
  DATA_EXPLORER_SECTION_NAMES,
  DATA_EXPLORER_FILTERS
} from 'data/constants';
import DataExplorerContentComponent from './data-explorer-content-component';
import {
  parseData,
  getInfoMetadata,
  getFilterOptions,
  getSelectedOptions
} from './data-explorer-content-selectors';

const mapStateToProps = (state, { section, location }) => {
  const search = qs.parse(location.search);
  const dataState = {
    data: state.dataExplorer && state.dataExplorer.data,
    countries: state.countries && state.countries.data,
    regions: state.regions && state.regions.data,
    meta: state.dataExplorer && state.dataExplorer.metadata,
    section,
    search
  };
  const SECTION_HREFS = {
    'historical-emissions': '/ghg-emissions',
    'ndc-sdg-linkages': '/ndcs-sdg',
    'ndc-content': '/ndcs-content',
    'emission-pathways': '/pathways'
  };
  const anchorLinks = [
    {
      label: 'Raw Data',
      hash: 'data',
      defaultActiveHash: true
    },
    { label: 'Methodology', hash: 'meta', defaultActiveHash: true }
  ];

  return {
    data: parseData(dataState),
    meta: getInfoMetadata(dataState),
    metadataSection: !!location.hash && location.hash === '#meta',
    loading: state.dataExplorer && state.dataExplorer.loading,
    loadingMeta: state.dataExplorer && state.dataExplorer.loadingMeta,
    firstColumnHeaders: DATA_EXPLORER_FIRST_COLUMN_HEADERS,
    href: SECTION_HREFS[section],
    downloadHref: `/api/v1/data/${DATA_EXPLORER_SECTION_NAMES[
      section
    ]}/download.csv`,
    filters: DATA_EXPLORER_FILTERS[section],
    filterOptions: getFilterOptions(dataState),
    selectedOptions: getSelectedOptions(dataState),
    anchorLinks,
    query: location.search
  };
};

class DataExplorerContentContainer extends PureComponent {
  handleFilterChange = (filterName, value) => {
    const { section } = this.props;
    this.updateUrlParam({
      name: `${section}-${filterName}`,
      value
    });
  };

  updateUrlParam(params, clear) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, params, clear));
  }

  render() {
    return createElement(DataExplorerContentComponent, {
      ...this.props,
      handleFilterChange: this.handleFilterChange
    });
  }
}

DataExplorerContentContainer.propTypes = {
  section: PropTypes.string,
  history: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(
  connect(mapStateToProps, null)(DataExplorerContentContainer)
);