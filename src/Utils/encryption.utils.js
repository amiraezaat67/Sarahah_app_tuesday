import crypto from 'node:crypto'
import fs from 'node:fs'

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY)
const IV_LENGTH = parseInt(process.env.IV_LENGTH)


export function encrypt (text){

    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher  = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
    
    let encrypted = cipher.update(text, 'utf-8' , 'hex')

    encrypted += cipher.final('hex')

    return iv.toString('hex') + ':' + encrypted;

}

export function decrypt (text) {

    const [ivHex , encryptedtext] = text.split(':')  // [iv , enc]
    const iv = Buffer.from(ivHex, 'hex')

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)

    let decrypted = decipher.update(encryptedtext, 'hex', 'utf-8')
    
    decrypted += decipher.final('utf-8')

    return decrypted
}


const publicKeyPath = 'publicKey.pem'
const privateKeyPath = 'privateKey.pem'

if(!(fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath))){
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync(publicKeyPath, publicKey)
    fs.writeFileSync(privateKeyPath, privateKey)
}

export function encryptAsymmetric(text){

    const publicKey = fs.readFileSync(publicKeyPath)
    const bufferedText = Buffer.from(text)

    const encrypted = crypto.publicEncrypt({
        key:publicKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
    } , bufferedText)


    return encrypted.toString('hex')
}


export function decryptAsymmetric(text){
    const bufferedText = Buffer.from(text , 'hex')
    const privateKey = fs.readFileSync(privateKeyPath)

    const decryption = crypto.privateDecrypt({
        key:privateKey,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
    },bufferedText)
    
    return decryption.toString('utf-8')
}