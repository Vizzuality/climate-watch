import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from 'components/multiselect';
import Tag from 'components/tag';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';

import plusIcon from 'assets/icons/plus.svg';
import styles from './legend-chart-styles.scss';

class LegendChart extends PureComponent {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      config,
      dataOptions,
      dataSelected,
      handleRemove,
      hideRemoveOptions,
      handleAdd,
      className
    } = this.props;
    const shouldShowMultiselect =
      dataOptions && dataSelected && dataSelected.length !== dataOptions.length;
    const mirrorX = dataSelected.length < 2;
    const hasColumns = config && config.columns && config.columns.y.length;

    return (
      <ul className={cx(styles.tags, className)}>
        {hasColumns &&
          config.columns.y.map(column => (
            <Tag
              className={styles.tag}
              key={`${column.value}`}
              data={{
                color: config.theme[column.value].stroke,
                label: column.label,
                id: column.value,
                url: column.url ? column.url : null,
                title: column.legendTooltip ? column.legendTooltip : null
              }}
              tooltipId="legend-tooltip"
              onRemove={handleRemove}
              canRemove={
                hideRemoveOptions ? false : config.columns.y.length > 1
              }
            />
          ))}
        {hasColumns && <ReactTooltip id="legend-tooltip" />}
        {shouldShowMultiselect && (
          <MultiSelect
            parentClassName={styles.tagSelector}
            values={dataSelected || []}
            options={dataOptions || []}
            onMultiValueChange={handleAdd}
            hideResetButton
            closeOnSelect
            dropdownDirection={-1}
            hideSelected
            icon={plusIcon}
            mirrorX={mirrorX}
          />
        )}
      </ul>
    );
  }
}

LegendChart.propTypes = {
  config: PropTypes.object,
  handleRemove: PropTypes.func,
  handleAdd: PropTypes.func,
  dataOptions: PropTypes.array,
  dataSelected: PropTypes.array,
  hideRemoveOptions: PropTypes.bool,
  className: PropTypes.string
};

export default LegendChart;
