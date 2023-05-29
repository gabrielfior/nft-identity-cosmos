import nacl, { box, randomBytes } from "tweetnacl";
import { decodeUTF8, encodeBase64 } from "tweetnacl-util";

const passphrase = "mySecret";
const newNonce = () => randomBytes(box.nonceLength);

export function encryptStringWithRsaPublicKey(
  toEncrypt: string,
  key1: string,
  key2: string
) {
  const keyA = nacl.box.keyPair.fromSecretKey(new Uint8Array(JSON.parse(key1)));
  const keyB = nacl.box.keyPair.fromSecretKey(new Uint8Array(JSON.parse(key2)));

  const sharedEncryption = box.before(keyA.publicKey, keyB.secretKey);
  const sharedDecryption = box.before(keyB.publicKey, keyA.secretKey);
  const encrypted = encrypt(sharedEncryption, toEncrypt);
  return encrypted;
}

export function encrypt(
  secretOrSharedKey: Uint8Array,
  json: any,
  key?: Uint8Array
) {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
}
