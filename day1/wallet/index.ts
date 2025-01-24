import * as bip39 from 'bip39';
import * as crypto_ts from 'crypto';

/*
- 随机熵生成：128-256， 128-12，160-15，192-18，224-21， 256-24
- 计算校验和：对熵进行 SHA-256 的计算，并取 Hash 的前几位做为校验和，校验和的长度取决于熵的长度
  - 128-4
  - 160-5
  - 192-6
  - 224-7
  - 256-8
- 组合熵和校验和: 将校验和加到熵的末尾，形成一个新到二进制序列，序列的长度：熵长度 + 校验和的长度
- 分割助记词索引：将组合后的二进制序列切割成每组 11 位的片段，每一片段转换成一个数字，这个数字作为助记词在列表中索引
- 映射为助记词：使用索引提取助记词，词库里面有 2048 个单词
 */
export function CreateMnemonic(mnemonicNum: number, language?: string) {
    const bits = CreateBits(mnemonicNum)

    return CreateMnemonicByBits(bits, language)
}

export function CreateBits(mnemonicNum: number) {
    if (!CheckMnemonicLength(mnemonicNum)) {
        throw new TypeError('Mnemonic length Not Standard!')
    }
    const entropyBytesNumber = GetEntropyBytesNumber(mnemonicNum)
    const checksumLength = GetChecksumLength(mnemonicNum)

    const entropy = crypto_ts.randomBytes(entropyBytesNumber)

    const checksum = crypto_ts.createHash('sha256').update(entropy).digest()[0]
        >> (8 - checksumLength)
    // console.log(crypto_ts.createHash('sha256').update(entropy).digest())

    let bits = ''
    for (let i = 0; i < entropy.length; i++) {
        bits += entropy[i].toString(2).padStart(8, '0')
    }
    // console.log(bits)
    bits += checksum.toString(2).padStart(checksumLength, '0')

    return bits
}

export function CreateMnemonicByBits(bits: string, language?: string) {
    let indices: number[] = []
    for (let index = 0; index < bits.length; index += 11) {
        const element = parseInt(bits.slice(index, index + 11), 2)
        indices.push(element)
    }

    const wordlist = bip39.wordlists[language || 'english']
    const mnemonic = indices.map(index => wordlist[index])

    // console.log(mnemonic)
    return mnemonic
}

/*
- 检查单词的数量是否落在 12，15，18，21 和 24
- 检查单词是否在 2048 个单词里面，任何一个词不在这个词库里面都是无效的助记词
- 将助记词转换成位串：将每个单词在词库中的索引转换成 11 位的二进制数，将所有的二进制数连接起来形成一个位串
- 提取种子和校验和：和上面的过程是逆过程
- 计算校验和：
- 验证校验和
 */
export function VerifyMnemonic(mnemonicStr: string, language?: string) {  // 作业
    const mnemonics = mnemonicStr.split(' ')
    const mnemonicNum = mnemonics.length
    const checksumLength = GetChecksumLength(mnemonicNum)

    const bits = GetBitsByMnemonic(mnemonicStr, language)
    const entropy = bits.slice(0, -checksumLength)
    const slideChecksum = parseInt(bits.slice(-checksumLength), 2)

    const entropyArray = binaryStringToBytes(entropy)

    const hash = crypto_ts.createHash('sha256').update(entropyArray).digest()
    // console.log(hash)
    const computeChecksum = hash[0] >> (8 - checksumLength)

    if (slideChecksum != computeChecksum) {
        throw TypeError("slideChecksum != computeChecksum")
    }
    return true
}

export function GetBitsByMnemonic(mnemonicStr: string, language?: string) {
    const mnemonics = mnemonicStr.split(' ')
    const mnemonicNum = mnemonics.length
    const entropyBits = GetEntropyBits(mnemonicNum)
    const checksumLength = GetChecksumLength(mnemonicNum)

    if (!CheckMnemonicLength(mnemonics.length)) {
        throw new TypeError('Mnemonic length Not Standard!')
    }

    const wordlist = bip39.wordlists[language || 'english']
    if (!mnemonics.every(word => wordlist.includes(word))) {
        throw new TypeError('Mnemonic not in wordlist')
    }

    let bits = ''
    for (let index = 0; index < mnemonics.length; index++) {
        const element = mnemonics[index];
        bits += wordlist.indexOf(element).toString(2).padStart(11, '0')
    }
    if (bits.length != entropyBits + checksumLength) throw TypeError("Invalid entropyBits length")

    return bits;
}

export function binaryStringToBytes(binaryString: string) {
    // 将二进制字符串按每 8 位分割，转换为字节数组
    const bytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
        const byteString = binaryString.slice(i, i + 8);
        const byte = parseInt(byteString, 2); // 将 8 位二进制字符串转换为十进制数
        bytes.push(byte);
    }

    return Buffer.from(bytes);
}

export function CheckMnemonicLength(mnemonicNum: number) {
    return mnemonicNum == 12 || mnemonicNum == 15 || mnemonicNum == 18 || mnemonicNum == 21 || mnemonicNum == 24;
}

export function GetEntropyBits(mnemonicNum: number) {
    return mnemonicNum / 3 * 32
}

export function GetEntropyBytesNumber(mnemonicNum: number) {
    return mnemonicNum / 3 * 4
}

export function GetChecksumLength(mnemonicNum: number) {
    return mnemonicNum / 3
}