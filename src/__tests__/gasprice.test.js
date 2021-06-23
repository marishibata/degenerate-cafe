import React from 'react';
import { render } from '@testing-library/react';
import GasPrice from '../Components/gasprice';
import WS from 'jest-websocket-mock'


let ws;
beforeEach(() => {
  WS.clean();
  ws = new WS('wss://www.gasnow.org/ws/gasprice');
});


describe('The Gas Price component', () => {
  it('renders loading before connection', async () => {
    const { findByText } = render(<GasPrice/>);
    const result = await findByText('loading');
    expect(result).toBeTruthy();
  });
  it('renders the gas prices and then opens a websocket connection', async () => {
    render(<GasPrice/>);
    const connection = await ws.connected;
    expect(connection.readyState).toEqual(1);
  });
});
