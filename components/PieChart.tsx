import React, { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { Severity, SeverityCounts } from '../types/types';

const SEVERITY_COLORS = {
    'low': '#99cc33',
    'medium': '#ffcc00',
    'high': '#ff9966',
    'critical': '#cc3300'
}

function buildPieProps(data: SeverityCounts) {
    const severityNames = Object.keys(data) as Severity[];
    return severityNames.map((severityName) => {
        const value = data[severityName];
        const color = SEVERITY_COLORS[severityName];
        return {
            title: severityName,
            value,
            color
        }
    })
}

type Props = {
  data: SeverityCounts;
}

function Pie(props: Props) {
  const [selected, setSelected] = useState<number | undefined>(0);

  return (
    <PieChart
      style={{
        fontFamily:
          '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
        fontSize: '8px',
        overflow: 'initial'
      }}
      data={buildPieProps(props.data)}
      radius={PieChart.defaultProps.radius - 6}
      lineWidth={60}
      segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
      segmentsShift={(index) => (index === selected ? 6 : 1)}
      animate
      label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
      labelPosition={110}
      labelStyle={{
        fill: '#fff',
        opacity: 0.75,
        pointerEvents: 'none',
      }}
      onClick={(_, index) => {
        setSelected(index === selected ? undefined : index);
      }}
    />
  );
}

export default Pie;