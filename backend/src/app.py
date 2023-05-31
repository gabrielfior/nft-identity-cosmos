from src.crypto import CryptoHandler
from src.derive_cluster_osmosis import OsmosisTraderClusterAlgorithm
from src.derive_cluster_lens import LensClusterAlgorithm
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()


class EncryptedContainer(BaseModel):
    encryptedValue: str

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/lens_profile_type")
async def fetch_lens_profile_type(profileContainer: EncryptedContainer):
    print('encrypted', str(profileContainer.encryptedValue))
    profile_id = CryptoHandler().decrypt_wallet(str(profileContainer.encryptedValue))
    data = LensClusterAlgorithm().get_cluster_index(profile_id)
    return (data)

@app.post('/osmosis_traders_cluster_index')
async def fetch_osmosis_trader_cluster_index(encrypted_wallet_address: EncryptedContainer):
    print ('encrypted', encrypted_wallet_address.encryptedValue)
    secret_wallet = CryptoHandler().decrypt_wallet(str(encrypted_wallet_address.encryptedValue))
    data  = OsmosisTraderClusterAlgorithm().get_cluster_index(secret_wallet)
    return (data)