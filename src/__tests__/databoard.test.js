import { jest } from '@jest/globals'
import React from 'react';
import Databoard from '../Components/databoard';
import { findByText, render, screen } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios', () => {
  return {
    default: () => {
      return new Promise((resolve, reject) => {
        resolve(
          {
            data: {
              coins: [
                {
                  item: {
                    id: 0,
                    name: 'YIELD App'
                  }
                },
                {
                  item: {
                    id: 1,
                    name: 'SafeMoon'
                  }
                },
              ]
            }
          }
        )
      })
    }
  }
});

describe('fear and greed section', () => {
  it('Successfully renders the component', async () => {
    const { findByText } = render(<Databoard />);
    const result = await findByText('Trending On Coingecko');
    expect(result).toBeTruthy();
  });

  it('Successfully fetches coin name', async () => {
    const { findByText } = render(<Databoard />);
    const result = await findByText('YIELD App')
    expect(result).toBeTruthy();
  });

  it('Renders consistently', async () => {
    const { asFragment } = render(<Databoard />);
    expect(asFragment()).toMatchSnapshot();
  })
});
