// src/context/SolanaContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as web3 from '@solana/web3.js';

const SolanaContext = createContext();

export const useSolana = () => useContext(SolanaContext);

export const SolanaProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [connection, setConnection] = useState(new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed'));

  // Connect to the wallet
  const connectWallet = async () => {
    if ('solana' in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        try {
          const response = await window.solana.connect();
          setProvider(provider);
          setPublicKey(response.publicKey.toString());
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      alert('Solana wallet not found! Please install Phantom Wallet.');
    }
  };

  // Disconnect the wallet
  const disconnectWallet = async () => {
    await window.solana.disconnect();
    setProvider(null);
    setPublicKey(null);
  };

  // Send Solana transaction (example)
  const sendTransaction = async (transaction) => {
    try {
      if (!provider) throw new Error('Wallet not connected');
      let { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = provider.publicKey;

      let signed = await provider.signTransaction(transaction);
      let txid = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(txid);
      return txid;
    } catch (error) {
      console.error('Failed to send transaction:', error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <SolanaContext.Provider value={{ publicKey, connectWallet, disconnectWallet, sendTransaction }}>
      {children}
    </SolanaContext.Provider>
  );
};
