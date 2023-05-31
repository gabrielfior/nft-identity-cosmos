## Data analysis

### Osmosis trader clustering

- We fetched Osmosis data from [Flipside](https://flipsidecrypto.xyz/), encompassing all trades from Osmosis for the last ~ 2 months.
- We used a simple [KMeans algorithm](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html) for clustering traders (wallet addresses) into 3 clusters (logic for this can be found in `derive_nft_tags.py`). With that, we generated a CSV mapping traders with clusters, which can be retrieved by our REST API. These tags help us identify early high-frequency traders, high volume traders and occasional traders.

### Lens profile clustering

- We fetched data from Lens using [Dune](https://dune.com/queries/2512946), fetching data related to profile followers, posts, comments, etc.
- We again used a KMeans algorithm for clustering lens profiles. We interpret the clusters (1-5) as follows:
  - Clusters 0 and 1 are very similar. They are the vast majority of Lens users. Those users have low follower count, they most not as frequent nor comment or mirror much. We label them as "Base users"
  -  Cluster 2 are users that post more than clusters 0 and 1. They tend to mirror more than others. We label them as the "reflectors".
  -  Cluster 3 have a huge follower count, those are the "influencers".
  -  Cluster 4 post heavily. Those are the "extroverts".
  -  Cluster 5 comments heavily. Those are users that do not post as much and do not have as much followers. We label them as "commentors".

