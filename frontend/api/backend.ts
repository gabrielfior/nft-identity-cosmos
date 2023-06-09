import axios from "axios";

export const fetchOsmosisProfile = async (encryptedAddress: string) => {
  const data = await axios.post(
    `http://localhost:8000/osmosis_traders_cluster_index`,
    { encryptedValue: encryptedAddress }
  );
  return data.data;
};

export const fetchLensProfileType = async (encryptedProfileId: string) => {
  const data = await axios.post(`http://localhost:8000/lens_profile_type`, {
    encryptedValue: encryptedProfileId,
  });
  return data.data;
};
