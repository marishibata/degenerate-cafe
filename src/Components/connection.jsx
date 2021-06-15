import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Column from "../UI-Components/Column";
import Modal from "../UI-Components//Modal";
import Header from "../UI-Components//Header";
import Loader from "../UI-Components//Loader";
import ModalResult from "../UI-Components//ModalResult";
import { apiGetAccountAssets } from "../helpers/api";
import { formatTestTransaction, getChainData } from "../helpers/utilities";
import { ETH_SEND_TRANSACTION } from "../constants";

const SLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const SContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

const INITIAL_STATE = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
};

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

class Connection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    });
  }

  componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
    });
    await this.getAccountAssets();
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("disconnect", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      await this.setState({ address: accounts[0] });
      await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });
  };

  getNetwork = () => getChainData(this.state.chainId).network;

  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "10cec0cd61594abca3b3b80896eb4f70",
        },
      },
    };
    return providerOptions;
  };

  getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      await this.setState({ fetching: false, assets });
    } catch (error) {
      console.error(error); // tslint:disable-line
      await this.setState({ fetching: false });
    }
  };

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  testSendTransaction = async () => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    const tx = await formatTestTransaction(address, chainId);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // @ts-ignore
      function sendTransaction(_tx) {
        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(_tx)
            .once("transactionHash", (txHash) => resolve(txHash))
            .catch((err) => reject(err));
        });
      }

      // send transaction
      const result = await sendTransaction(tx);

      // format displayed result
      const formattedResult = {
        action: ETH_SEND_TRANSACTION,
        txHash: result,
        from: address,
        to: address,
        value: "0 ETH",
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null,
      });
    } catch (error) {
      console.error(error); // eslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.disconnect) {
      await web3.currentProvider.disconnect();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };

  render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result,
    } = this.state;
    return (
      <SLayout>
        <Column maxWidth={1000}>
          <Header
            connected={connected}
            address={address}
            chainId={chainId}
            killSession={this.resetApp}
            onConnect={this.onConnect}
          />
        </Column>
        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>
                  {"Approve or reject request using your wallet"}
                </SModalParagraph>
              </SContainer>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <ModalResult>{result}</ModalResult>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalTitle>{"Call Request Rejected"}</SModalTitle>
            </SModalContainer>
          )}
        </Modal>
      </SLayout>
    );
  };
}

export default Connection;
