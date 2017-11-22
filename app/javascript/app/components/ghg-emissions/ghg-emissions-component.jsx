import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EmissionsMetaProvider from 'providers/ghg-emissions-meta-provider';
import RegionsProvider from 'providers/regions-provider';
import ChartLine from 'components/charts/line';
import Dropdown from 'components/dropdown';
import ButtonGroup from 'components/button-group';
import Tag from 'components/tag';
import MultiSelect from 'components/multiselect';
import Loading from 'components/loading';
import NoContent from 'components/no-content';

import styles from './ghg-emissions-styles.scss';

class GhgEmissions extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      data,
      config,
      groups,
      sources,
      sourceSelected,
      handleSourceChange,
      handleInfoClick,
      versions,
      versionSelected,
      handleVersionChange,
      breaksBy,
      breakSelected,
      handleBreakByChange,
      filters,
      filtersSelected,
      handleFilterChange,
      handleRemoveTag,
      loading,
      activeFilterRegion
    } = this.props;
    return (
      <div>
        <h2 className={styles.title}>Global Historical Emissions</h2>
        <RegionsProvider />
        <EmissionsMetaProvider />
        <div className={styles.col4}>
          <Dropdown
            label="Source"
            options={sources}
            onValueChange={handleSourceChange}
            value={sourceSelected}
            hideResetButton
          />
          <Dropdown
            label="IPCC Version"
            options={versions}
            onValueChange={handleVersionChange}
            value={versionSelected}
            hideResetButton
            disabled={versions && versions.length === 1}
          />
          <Dropdown
            label="Break by"
            options={breaksBy}
            onValueChange={handleBreakByChange}
            value={breakSelected}
            hideResetButton
          />
          <MultiSelect
            selectedLabel={activeFilterRegion ? activeFilterRegion.label : null}
            label={breakSelected.label}
            groups={breakSelected.value === 'location' ? groups : null}
            values={filtersSelected || []}
            options={filters || []}
            onMultiValueChange={handleFilterChange}
          />
          <ButtonGroup
            className={styles.colEnd}
            onInfoClick={handleInfoClick}
          />
        </div>
        <div className={styles.chartWrapper}>
          {loading && (
            <Loading light className={styles.loader} />
          )}
          {!loading &&
            (!data || !data.length) && (
              <NoContent
                message={filtersSelected && filtersSelected.length ? 'No data available' : 'No data selected'}
                className={styles.noContent}
                icon
              />
            )}
          {data && config &&
            <div>
              <ChartLine config={config} data={data} height={500} domain={[0, 'auto']} />
              <div className={styles.tags}>
                {config.columns &&
                  config.columns.y.map(column => (
                    <Tag
                      className={styles.tag}
                      key={`${column.value}`}
                      data={{
                        color: config.theme[column.value].stroke,
                        label: column.label,
                        id: column.value
                      }}
                      canRemove
                      onRemove={handleRemoveTag}
                    />
                  ))}
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

GhgEmissions.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  groups: PropTypes.array,
  versions: PropTypes.array,
  versionSelected: PropTypes.object,
  handleVersionChange: PropTypes.func.isRequired,
  sources: PropTypes.array,
  sourceSelected: PropTypes.object,
  handleInfoClick: PropTypes.func.isRequired,
  handleSourceChange: PropTypes.func.isRequired,
  breaksBy: PropTypes.array,
  breakSelected: PropTypes.object,
  handleBreakByChange: PropTypes.func.isRequired,
  handleRemoveTag: PropTypes.func.isRequired,
  filters: PropTypes.array,
  filtersSelected: PropTypes.array,
  handleFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  activeFilterRegion: PropTypes.object
};

export default GhgEmissions;
