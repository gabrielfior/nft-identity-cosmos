
'''
Clusters 0 and 1 are very similar. They are the vast majority of Lens users. Those users have low follower count, they most not as frequent nor comment or mirror much. I would label them as "Base users"
Cluster 2 are users that post more than clusters 0 and 1. They tend to mirror more than others. I would label them as the "reflectors"
Cluster 3 have a huge follower count, those are the "influencers"
Cluster 4 post heavily. Those are the "extroverts"
Cluster 5 comments heavily. Those are users that do not post as much and do not have as much followers. I would label them as "commentors"
'''
osmosisProfileType ={
    0:  "Crab",
    1:  "Whale",
    2:  "Whale",
    -1: "Unknown"
}  
import pandas as pd
import pathlib
from src.base_cluster_algorithm import BaseClusterAlgorithm
from fastapi import HTTPException

class OsmosisTraderClusterAlgorithm(BaseClusterAlgorithm):
    def get_cluster_index(self, wallet_address: str):
        filepath = pathlib.Path(__file__).parent.parent.joinpath('data','osmosis_clusters_wallet_mapping.csv')
        data_with_clusters = pd.read_csv(filepath)
        found_trader = data_with_clusters.loc[data_with_clusters['TRADER'] == wallet_address].cluster
        if len(found_trader) > 0:
            # return 0,1,2 for cluster index
            return osmosisProfileType[found_trader.values[0]]
        else:
            return osmosisProfileType[-1]
        
        