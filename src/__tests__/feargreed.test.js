import React from 'react';
import { render } from '@testing-library/react';
import FearGreed from '../Components/feargreed';

jest.mock('axios', () => {
  return {
    default: () => {
      return new Promise((resolve, reject) => {
        resolve({
          data: {data: [
            {
              value: 0,
              value_classification: "Extreme Fear"
            }
          ]}
        })
      })
    }
  }
})

describe('fear and greed section', () => {
  it('Renders consistently', async () => {
    const { asFragment } = render(<FearGreed/>);
    expect(asFragment()).toMatchSnapshot();
  })

  it('Successfully renders the component to the screen', async () => {
    const { findByText } = render(<FearGreed/>);
    const result = await findByText("Today's Cryptocurrency Fear And Greed Index");
    expect(result).toBeTruthy();
  })

  it('Successfully fetches F&G index', async () => {
    const { findByText } = render(<FearGreed/>);
    const result = await findByText('Extreme Fear');
    expect(result).toBeTruthy();
  })
})