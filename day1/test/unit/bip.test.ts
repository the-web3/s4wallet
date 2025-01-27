import {
    generateMnemonic,
    encodeMnemonic,
    decodeMnemonic,
    mnemonicToSeed,
    mnemonicToEntropy,
    validateMnemonic,
} from '../../wallet/bip/bip';
import * as bip39 from 'bip39';

describe('Mnemonic Functions', () => {
    // 测试 generateMnemonic
    describe('generateMnemonic', () => {
        it('should generate a valid mnemonic for valid input', () => {
            const mnemonic = generateMnemonic({ number: 12, language: 'english' });
            expect(mnemonic.split(' ').length).toBe(12);
            expect(bip39.validateMnemonic(mnemonic)).toBe(true);
        });

        it('should throw an error for invalid mnemonic length', () => {
            expect(() => generateMnemonic({ number: 10, language: 'english' })).toThrow(
                'Mnemonic length Not Standard!',
            );
        });

        it('should throw an error for unsupported language', () => {
            expect(() => generateMnemonic({ number: 12, language: 'invalid' })).toThrow(
                'Language not supported',
            );
        });
    });

    // 测试 encodeMnemonic
    describe('encodeMnemonic', () => {
        it('should encode a valid mnemonic', () => {
            const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
            const entropy = encodeMnemonic({ mnemonic, language: 'english' });
            expect(entropy).toBeDefined();
            expect(entropy.length).toBeGreaterThan(0);
        });

        it('should throw an error for unsupported language', () => {
            const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
            expect(() => encodeMnemonic({ mnemonic, language: 'invalid' })).toThrow(
                'Language not supported',
            );
        });
    });

    // 测试 decodeMnemonic
    describe('decodeMnemonic', () => {
        it('should decode a valid entropy to mnemonic', () => {
            const entropy = bip39.mnemonicToEntropy(
                bip39.generateMnemonic(128, undefined, bip39.wordlists.english),
            );
            const mnemonic = decodeMnemonic({ encrytMnemonic: entropy, language: 'english' });
            expect(mnemonic).toBeDefined();
            expect(mnemonic.split(' ').length).toBe(12);
        });

        it('should throw an error for unsupported language', () => {
            const entropy = bip39.mnemonicToEntropy(
                bip39.generateMnemonic(128, undefined, bip39.wordlists.english),
            );
            expect(() => decodeMnemonic({ encrytMnemonic: entropy, language: 'invalid' })).toThrow(
                'Language not supported',
            );
        });
    });

    // 测试 mnemonicToSeed
    describe('mnemonicToSeed', () => {
        it('should generate a seed from a valid mnemonic', () => {
            const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
            const seed = mnemonicToSeed({ mnemonic, password: 'password' });
            expect(seed).toBeDefined();
            expect(seed.length).toBeGreaterThan(0);
        });

        it('should throw an error for missing mnemonic', () => {
            expect(() => mnemonicToSeed({ mnemonic: null, password: 'password' })).toThrow(
                'Must have mnemonic',
            );
        });
    });
    // 测试 mnemonicToEntropy
    describe('mnemonicToEntropy', () => {
        it('should generate entropy from a valid mnemonic', () => {
            const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
            const entropy = mnemonicToEntropy({ mnemonic, language: 'english' });
            expect(entropy).toBeDefined();
            expect(entropy.length).toBeGreaterThan(0);
        });

        it('should throw an error for missing mnemonic', () => {
            expect(() => mnemonicToEntropy({ mnemonic: null, language: 'english' })).toThrow(
                'Must have mnemonic',
            );
        });
    });

    // 测试 validateMnemonic
    describe('validateMnemonic', () => {
        it('should validate a valid mnemonic', () => {
            const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
            const isValid = validateMnemonic({ mnemonic, language: 'english' });
            expect(isValid).toBe(true);
        });

        it('should throw an error for unsupported language', () => {
            const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.english);
            expect(() => validateMnemonic({ mnemonic, language: 'invalid' })).toThrow(
                'Language not supported',
            );
        });
    });
});