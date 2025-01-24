import * as bip39 from 'bip39';
import { GetEntropyBits, CheckMnemonicLength } from '../index';

export function generateMnemonic(params: { number: any; language: any; }) {
  const { number, language } = params;

  if (!number && !language) throw new Error('Must have language and language');
  if (!CheckMnemonicLength(number)) throw new Error('Mnemonic length Not Standard!');
  if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

  return bip39.generateMnemonic(GetEntropyBits(number), undefined, bip39.wordlists[language]);
}

export function encodeMnemonic(params: { mnemonic: any; language: any; }) {
  const { mnemonic, language } = params;

  if (!mnemonic && !language) throw new Error('Must have mnemonic and language');
  if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

  return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists[language]);
}

export function decodeMnemonic(params: { encrytMnemonic: any; language: any; }) {
  const { encrytMnemonic, language } = params;

  if (!encrytMnemonic && !language) throw new Error('Must have mnemonic and language');
  if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

  return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists[language]);
}

export function mnemonicToSeed(params: { mnemonic: any; password: any; }) {
  const { mnemonic, password } = params;

  if (!mnemonic) throw new Error('Must have mnemonic');

  return bip39.mnemonicToSeedSync(mnemonic, password);
}

export function mnemonicToEntropy(params: { mnemonic: any; language: any; }) {
  const { mnemonic, language } = params;

  if (!mnemonic) throw new Error('Must have mnemonic');

  return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists[language]);
}

export function validateMnemonic(params: { mnemonic: any; language: any; }) {
  const { mnemonic, language } = params;

  if (!mnemonic && !language) throw new Error('Must have mnemonic and language');
  if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

  return bip39.validateMnemonic(mnemonic, bip39.wordlists[language]);
}
