import { CreateMnemonic } from "../wallet"
import { generateMnemonic, mnemonicToSeed } from "../wallet/bip/bip"

describe("unit test file", () => {
    // Test address creation
    test("HelloWorld", () => {
        CreateMnemonic();
    })


    test("generateMnemonic", () => {
        const param = { number: 12, language: 'chinese_traditional' }
        const word = generateMnemonic(param);
        console.log(word)
        const paramsone = { mnemonic: word, password: '' }
        const seed = mnemonicToSeed(paramsone);
        console.log(seed.toString('hex'))
    })
})
