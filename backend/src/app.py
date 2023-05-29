from src.derive_cluster_osmosis import OsmosisTraderClusterAlgorithm
from src.derive_cluster_lens import LensClusterAlgorithm
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/lens_profile_type/profile_id/{:profile_id}")
async def fetch_lens_profile_type(profile_id: str):
    # ToDo - return for osmosis_trader
    # ToDo - lens profile
    data = LensClusterAlgorithm().get_cluster_index(profile_id)
    return {"profile_type": (data)}

@app.post('/osmosis_traders_cluster_index/address/{:wallet_address}')
async def fetch_osmosis_trader_cluster_index(wallet_address: str):
    data  = OsmosisTraderClusterAlgorithm().get_cluster_index(wallet_address)
    return {"profile_type": (data)}