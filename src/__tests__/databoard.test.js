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

test('Successfully fetches coin name', async () => {
  const { findByText } = render(<Databoard />);
  const result = await findByText('YIELD App')
  expect(result).toBeTruthy();
})
