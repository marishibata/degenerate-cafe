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
  it('Successfully fetches F&G index', async () => {
    const { findByText } = render(<FearGreed/>);
    const result = await findByText('Extreme Fear');
    expect(result).toBeTruthy();
  })
})