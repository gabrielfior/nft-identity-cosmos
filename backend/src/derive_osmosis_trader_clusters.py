import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans


def build_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Prepares data for clustering algorithm
    :param data:
    :return: pd.DataFrame
    """
    data = pd.DataFrame(df.groupby(by=['TRADER']).size(), columns=['n_trades'])
    data['avg_from_amount'] = df.groupby(by=['TRADER'])['FROM_AMOUNT'].mean()
    data['avg_to_amount'] = df.groupby(by=['TRADER'])['TO_AMOUNT'].mean()

    return data


def plot_results(data: pd.DataFrame) -> None:
    """
    Plot results
    :param data:
    :return:
    """
    plt.style.use('ggplot')
    plt.title("Clusters of traders")
    plt.scatter(data['n_trades'], data['avg_to_amount'], c=kmeans.labels_.astype(float), s=50, alpha=0.5)
    plt.scatter(centroids[:, 0], centroids[:, 1], c='red', s=50)
    plt.show()


if __name__ == "__main__":
    # Data reading
    url = 'https://gist.githubusercontent.com/gabrielfior/b9b80b181407a6f53f2a5020ed718e72/raw/7c0197d4f437f55447ee4713c18790bf0e996e09/osmosis_trades.csv'
    data = pd.read_csv(url)

    # Data processing
    columns = ['TRADER', 'FROM_CURRENCY', 'FROM_AMOUNT', 'TO_AMOUNT', 'TO_CURRENCY']
    df = data[columns]
    df.FROM_AMOUNT = df.FROM_AMOUNT.astype(float)
    df.TO_AMOUNT = df.TO_AMOUNT.astype(float)

    # Clustering algo
    data = build_metrics(df=df)
    kmeans = KMeans(n_clusters=3, n_init='auto').fit(data)
    centroids = kmeans.cluster_centers_

    # Visualization
    plot_results(data)