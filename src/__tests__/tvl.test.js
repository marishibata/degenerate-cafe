import React from 'react';
import { render } from '@testing-library/react';
import TVL from '../Components/tvl';

jest.mock('axios', () => {
  return {
    default: () => {
      return new Promise((resolve, reject) => {
        resolve({
          data:  [
            {
              id: "1",
              name: "Uniswap",
              tvl: 100000,
              change_1d: -100
            },
          ]
        })
      })
    }
  }
});


describe('TVL section', () => {
  it('Renders consistently', async () => {
    const { asFragment } = render(<TVL/>);
    expect(asFragment()).toMatchSnapshot();
  })


  it('Successfully renders the TVL component', async () => {
    const { findByText } = render(<TVL/>);
    const result = await findByText('DeFi Protocol Total Value Locked');
    expect(result).toBeTruthy();
  })

  it('Successfully fetches TVL data', async () => {
    const { findByText } = render(<TVL/>);
    const result = await findByText('Uniswap');
    expect(result).toBeTruthy();
  })
})