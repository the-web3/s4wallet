import * as assert from "assert";
import {
    CreateMnemonic,
    GetEntropyBytesNumber,
    GetEntropyBits,
    CheckMnemonicLength,
    VerifyMnemonic,
    CreateMnemonicByBits,
    GetBitsByMnemonic,
    CreateBits,
} from "../../wallet/index";

describe("unit test file", () => {
    // Test address creation

    test("expect mnemonic length meet", () => {
        const length = [12, 15, 18, 21, 24];
        length.forEach((element) => {
            expect(CreateMnemonic(element).length == element).toBe(true);
        });
    });

    test("test mnemonic length", () => {
        const length = [12, 15, 18, 21, 24];
        const bitsLength = [128, 160, 192, 224, 256];
        const entropyBytesNumber = [16, 20, 24, 28, 32];

        for (let index = 0; index < length.length; index++) {
            expect(GetEntropyBytesNumber(length[index]) == entropyBytesNumber[index]).toBe(true);
            expect(GetEntropyBits(length[index]) == bitsLength[index]).toBe(true);
        }
    });
    // 测试 CheckMnemonicLength
    describe('CheckMnemonicLength', () => {
        it('should return true for valid mnemonic lengths', () => {
            expect(CheckMnemonicLength(12)).toBe(true);
            expect(CheckMnemonicLength(15)).toBe(true);
            expect(CheckMnemonicLength(18)).toBe(true);
            expect(CheckMnemonicLength(21)).toBe(true);
            expect(CheckMnemonicLength(24)).toBe(true);
        });

        it('should return false for invalid mnemonic lengths', () => {
            expect(CheckMnemonicLength(10)).toBe(false);
            expect(CheckMnemonicLength(13)).toBe(false);
            expect(CheckMnemonicLength(25)).toBe(false);
        });
    });

    // 测试 GetEntropyBits
    describe('GetEntropyBits', () => {
        it('should return correct entropy bits for valid mnemonic lengths', () => {
            expect(GetEntropyBits(12)).toBe(128);
            expect(GetEntropyBits(15)).toBe(160);
            expect(GetEntropyBits(18)).toBe(192);
            expect(GetEntropyBits(21)).toBe(224);
            expect(GetEntropyBits(24)).toBe(256);
        });
    });

    // 测试 GetEntropyBytesNumber
    describe('GetEntropyBytesNumber', () => {
        it('should return correct entropy bytes for valid mnemonic lengths', () => {
            expect(GetEntropyBytesNumber(12)).toBe(16);
            expect(GetEntropyBytesNumber(15)).toBe(20);
            expect(GetEntropyBytesNumber(18)).toBe(24);
            expect(GetEntropyBytesNumber(21)).toBe(28);
            expect(GetEntropyBytesNumber(24)).toBe(32);
        });
    });

    // 测试 CreateMnemonic
    describe('CreateMnemonic', () => {
        it('should generate a valid mnemonic for valid input', () => {
            const mnemonic = CreateMnemonic(12);
            expect(mnemonic.length).toBe(12);
            expect(mnemonic.every(word => typeof word === 'string')).toBe(true);
        });

        it('should throw an error for invalid mnemonic length', () => {
            expect(() => CreateMnemonic(10)).toThrow('Mnemonic length Not Standard!');
        });

        it('should generate a mnemonic in the specified language', () => {
            const mnemonic = CreateMnemonic(12, 'french');
            expect(mnemonic.length).toBe(12);
            expect(mnemonic.every(word => typeof word === 'string')).toBe(true);
        });
    });
    // "peace fatal mass couch solve various fence achieve dynamic uncle panther minute"
    //"101000011100101001110010001000100001100001111100111011111110001100010101010000000000111001000100110111011001001001111111010001101010"
    describe('Verify Entropy to Mnemonic', () => {
        it('generate Mnemonic by Entropy', () => {
            const bits = CreateBits(12)
            const mnemonic = CreateMnemonicByBits(bits, 'english')

            const bits2 = GetBitsByMnemonic(mnemonic.join(' '), 'english')
            assert.ok(VerifyMnemonic(mnemonic.join(' ')))
            assert.strictEqual(bits, bits2)
        });
    });

    describe('VerifyMnemonic', () => {
        // 测试有效的助记词 
        describe('Valid Mnemonics', () => {
            it('should return true for a valid 12-word mnemonic', () => {
                const mnemonicNum = [12, 15, 18, 21, 24]
                mnemonicNum.forEach((element) => {
                    expect(VerifyMnemonic(CreateMnemonic(element).join(' '))).toBe(true);
                })

            });

            it('should return true for a valid mnemonic in a different language', () => {
                const mnemonicNum = [12, 15, 18, 21, 24]
                const languageList = ['chinese_simplified', 'chinese_traditional', 'english', 'french', 'italian', 'japanese', 'korean', 'spanish']

                mnemonicNum.forEach((element) => {
                    languageList.forEach((language) => {
                        expect(VerifyMnemonic(CreateMnemonic(element, language).join(' '), language)).toBe(true);
                    })
                })
            });
        });

        // 测试无效的助记词
        describe('Invalid Mnemonics', () => {
            it('should throw an error for an invalid mnemonic length', () => {
                const invalidMnemonic = 'word1 word2 word3'; // 3 words
                expect(() => VerifyMnemonic(invalidMnemonic)).toThrow('Mnemonic length Not Standard!');
            });

            it('should throw an error for a mnemonic with invalid words', () => {
                const invalidMnemonic = 'invalidword1 invalidword2 invalidword3 invalidword4 invalidword5 invalidword6 invalidword7 invalidword8 invalidword9 invalidword10 invalidword11 invalidword12';
                expect(() => VerifyMnemonic(invalidMnemonic)).toThrow('Mnemonic not in wordlist');
            });

            it('should throw an error for a mnemonic with an invalid checksum', () => {
                const validMnemonic = CreateMnemonic(12).join(' ');
                const invalidMnemonic = validMnemonic.split(' ').slice(0, -1).join(' ') + ' invalidword'; // 替换最后一个单词
                expect(() => VerifyMnemonic(invalidMnemonic)).toThrow('Mnemonic not in wordlist');
            });
        });
    });
});
