import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import TooltipChart from 'components/charts/tooltip-chart';
import { format } from 'd3-format';
import debounce from 'lodash/debounce';

class ChartLine extends PureComponent {
  debouncedMouseMove = debounce(year => {
    this.props.onMouseMove(year);
  }, 80);

  handleMouseMove = e => {
    const year = e && e.activeLabel;
    if (year) {
      this.debouncedMouseMove(year);
    }
  };

  render() {
    const { config, data, height, domain } = this.props;
    return (
      <ResponsiveContainer height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 0, left: -10, bottom: 0 }}
          onMouseMove={this.handleMouseMove}
        >
          <XAxis
            dataKey="x"
            tick={{ stroke: '#8f8fa1', strokeWidth: 0.5, fontSize: '13px' }}
            padding={{ left: 15, right: 20 }}
            tickSize={8}
          />
          <YAxis
            axisLine={false}
            tickFormatter={tick => `${format('.2s')(tick)}t`}
            tickLine={false}
            tick={{ stroke: '#8f8fa1', strokeWidth: 0.5, fontSize: '13px' }}
            domain={domain || ['auto', 'auto']}
          />
          <CartesianGrid vertical={false} />
          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: '#113750', strokeWidth: 2 }}
            content={content => (
              <TooltipChart content={content} config={config} />
            )}
          />
          {config.columns &&
            config.columns.y.map(column => (
              <Line
                key={column.value}
                dataKey={column.value}
                dot={false}
                stroke={config.theme[column.value].stroke || ''}
                strokeWidth={2}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

ChartLine.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  height: PropTypes.any.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  domain: PropTypes.array
};

ChartLine.defaultProps = {
  height: '100%',
  onMouseMove: () => {}
};

export default ChartLine;
