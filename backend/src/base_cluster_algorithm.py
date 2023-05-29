from abc import ABC, abstractmethod

class BaseClusterAlgorithm(ABC):

    @abstractmethod
    def get_cluster_index(self, profile_id: str):
        pass