import React from 'react';
import { render } from '@testing-library/react';
import LineChart from './LineChart';

test('renders LineChart component', () => {
    const data = {
        labels: ['January', 'February', 'March'],
        datasets: [
            {
                label: 'Position Size',
                data: [10, 20, 30],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const { getByText } = render(<LineChart data={data} options={{ responsive: true }} />);
    expect(getByText('Position Size')).toBeInTheDocument();
});