
'''
Clusters 0 and 1 are very similar. They are the vast majority of Lens users. Those users have low follower count, they most not as frequent nor comment or mirror much. I would label them as "Base users"
Cluster 2 are users that post more than clusters 0 and 1. They tend to mirror more than others. I would label them as the "reflectors"
Cluster 3 have a huge follower count, those are the "influencers"
Cluster 4 post heavily. Those are the "extroverts"
Cluster 5 comments heavily. Those are users that do not post as much and do not have as much followers. I would label them as "commentors"
'''
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