import React from 'react';
import { render } from '@testing-library/react';
import BarChart from './BarChart';

test('renders BarChart component', () => {
    const data = {
        labels: ['January', 'February', 'March'],
        datasets: [
            {
                label: 'Realized PnL',
                data: [10, 20, 30],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const { getByText } = render(<BarChart data={data} options={{ responsive: true }} />);
    expect(getByText('Realized PnL')).toBeInTheDocument();
});