import React from 'react';
import { render } from '@testing-library/react';
import News from '../Components/news';


jest.mock('axios', () => {
  return {
    default: () => {
      return new Promise((resolve, reject) => {
        resolve({
          data: {data: [
            {
              id: "0abcd",
              title: "Lorem ipsum",
              url: "https://messari.io/article/lorem-ipsum"
            },
            {
              id: "1abcd",
              title: "Testing",
              url: "https://messari.io/article/testing"
            }
          ]}
        })})
    
    }
  }
});


describe('news section', () => {
  it('Renders consistently', async () => {
    const { asFragment } = render(<News/>);
    expect(asFragment()).toMatchSnapshot();
  })

  it('Successfully renders news component', async () => {
    const { findByText } = render(<News/>);
    const result = await findByText('News (Sourced From Messari)');
    expect(result).toBeTruthy();
  })


  it('Successfully fetches news articles', async () => {
    const { findByText } = render(<News/>);
    const result = await findByText('Lorem ipsum')
    expect(result).toBeTruthy();
  })
})