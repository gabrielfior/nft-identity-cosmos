from nacl.public import PrivateKey, Box, PublicKey
from nacl.encoding import HexEncoder, Base64Encoder
import base64
import os


class CryptoHandler:
    def __init__(self) -> None:
        self.key1 = PrivateKey(os.environ['key1secret'], Base64Encoder)
        self.key2 = PrivateKey(os.environ['key2secret'], Base64Encoder)
        self.sharedEncryption = Box(self.key2, self.key1.public_key)
        self.sharedDecryption = Box(self.key1, self.key2.public_key)
    
    def decrypt_wallet(self, encrypted_wallet: str):
        #secret = b"osmo1cyyzpxplxdzkeea7kwsydadg87357qnahakaks"
        to_decrypt_bytes = base64.b64decode(encrypted_wallet)
        decrypted = self.sharedDecryption.decrypt(to_decrypt_bytes)
        secret_wallet = decrypted.decode('utf-8')
        print('original', secret_wallet)
        return secret_wallet.replace('"','')
