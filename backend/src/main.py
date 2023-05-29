import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Assuming df is your DataFrame and it doesn't contain any null values.

# Create a new DataFrame for clustering
df = pd.read_csv('data/lens_profiles.csv')
#data = df[['follower_count', 'post_count', 'comment_count', 'mirror_count']]

# Scale the data
scaler = StandardScaler()
data_scaled = scaler.fit_transform(df)

# Determine the optimal number of clusters
wcss = []  # within-cluster sum of square
for i in range(1, 11):
    kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=0)
    kmeans.fit(data_scaled)
    wcss.append(kmeans.inertia_)
# plt.plot(range(1, 11), wcss)
# plt.title('Elbow Method')
# plt.xlabel('Number of clusters')
# plt.ylabel('WCSS')
# plt.show()

# From the above graph, let's assume 4 is the optimal number of clusters.

kmeans = KMeans(n_clusters=4, init='k-means++', max_iter=300, n_init=10)
pred_y = kmeans.fit_predict(data_scaled)

df['cluster'] = pred_y  # append labels to original DataFrame

# Now your DataFrame has an additional column 'cluster' that indicates which cluster a user belongs to.
profile_id=130
print(df[df['profile_id'] == profile_id].shape)