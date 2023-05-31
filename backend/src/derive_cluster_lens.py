lensProfileType ={
    0:  "Base_user",
    1:  "Base_user",
    2: "Reflector",
    3 : "Influencer",
    4 : "Extrovert",
    5 : "Commentors"
}  
import pandas as pd
import pathlib
from src.base_cluster_algorithm import BaseClusterAlgorithm
from fastapi import HTTPException

class LensClusterAlgorithm(BaseClusterAlgorithm):
    def get_cluster_index(self, profile_id: str):
        
        filepath = pathlib.Path(__file__).parent.parent.joinpath('data','clusters.csv')
        
        df = pd.read_csv(filepath)
        
        if not (int(profile_id) in df['profileid']):
            raise HTTPException(status_code=400, detail=f"profile_id {profile_id} not available")
        
        cluster = df[df['profileid'] == int(profile_id)]['cluster']
        cluster_value = cluster.values[0]     
        return lensProfileType[cluster_value]