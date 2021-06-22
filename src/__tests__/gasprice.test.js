import React from 'react';
import { render } from '@testing-library/react';
import GasPrice from '../Components/gasprice';
import WS from 'jest-websocket-mock'


let ws;
beforeEach(() => {
  ws = new WS('wss://www.gasnow.org/ws/gasprice');
});
afterEach(() => {
  WS.clean();
});


describe('The Gas Price component', () => {
  it('renders loading before connection', async () => {
    const { findByText, debug } = render(<GasPrice/>);
    const result = await findByText('loading');
    expect(result).toBeTruthy();
    await ws.connected;
    debug();
  })
})