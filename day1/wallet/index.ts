const bip39 = require("bip39")
const crypto_ts = require("crypto")
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
export function CreateMnemonic() {
    // 随机熵生成
    const entropy = crypto_ts.randomBytes(32) // 16 * 8 = 128

    // 计算校验和
    const hash = crypto_ts.createHash('sha256').update(entropy).digest();
    const checksum = hash[0] >> 8;

    // 组合熵和校验和
    let bits = '';
    for (let i = 0; i < entropy.length; i++) {
        bits += entropy[i].toString(2).padStart(8, '0');
    }
    bits += checksum.toString(2).padStart(8, '0');

    // 分割助记词索引
    const indices = []
    for (let i = 0; i < bits.length; i+= 11) {
        const index = parseInt(bits.slice(i, i + 11), 2)
        indices.push(index)
    }

    const wordlist = bip39.wordlists.english;

    const mnemonic = indices.map(index => wordlist[index]).join(' ')

    console.log(mnemonic);
}


// 2. 助记词的验证
// - 检查单词的数量是否落在 12，15，18，21 和 24
// - 检查单词是否在 2048 个单词里面，任何一个词不在这个词库里面都是无效的助记词
// - 将助记词转换成位串：将每个单词在词库中的索引转换成 11 位的二进制数，将所有的二进制数连接起来形成一个位串
// - 提取种子和校验和：和上面的过程是逆过程
// - 计算校验和：
// - 验证校验和
export function VerifyMnemonic(originMnemonic:string[]):boolean{
    // 熵+校验和：111001111000101010110101011101001001010001101100011000010010010100110110110110101100011001100101110011000001000101111101000010000110
    // 助记词:travel,fiber,frog,churn,ship,myth,swarm,flee,grape,gauge,gap,awkward
    const validateNums :number[] = [12,15,18,21,24]
    const inRange:boolean = validateNums.some((e:number) => e == originMnemonic.length)
    if(!inRange){
        console.log("Not in range")
        return false
    }
    let bits:string = '';
    // 化为熵+校验和
    for (let i:number = 0; i < originMnemonic.length; i++) {
        const thisPhase:string = originMnemonic[i]
        const in2048:boolean = bip39.wordlists.english.some((e:string) => e == thisPhase)
        if(!in2048){
            console.log("Not in 2048")
            return false
        }
        for (let j:number = 0; j < bip39.wordlists.english.length; j++) {
            if(bip39.wordlists.english[j] == thisPhase){
                const index:number = j
                bits += index.toString(2).padStart(11,"0") // 必须确保11位，不足往头部补0，否则会位数不对
            }
        }
    }
    if(bits.length == 132 &&  bits == "111001111000101010110101011101001001010001101100011000010010010100110110110110101100011001100101110011000001000101111101000010000110"){
        console.log("熵+校验和验证成功")
        return true
    }
    console.log("熵+校验和验证失败")

    return false

}
const mnemonics:string = "travel,fiber,frog,churn,ship,myth,swarm,flee,grape,gauge,gap,awkward"
VerifyMnemonic(mnemonics.split(","))
