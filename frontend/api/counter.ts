import useSWR from "swr";
import { getAddress, getClient, getSigningClient } from "../lib/client";
import { getContractAddr, getNftContractAddr } from "../lib/state";
import { NftGeneratorQueryClient } from "../contracts/NftGenerator.client";

export const getQueue = async () => {
  const client = await getClient();
  return await client.queryContractSmart(getContractAddr(), {
    get_caller_recipient: {},
  });
};

export const getNftFromUser = async () => {
  const client = await getClient();
  const nftClient = new NftGeneratorQueryClient(client, getNftContractAddr());
  const user = await getAddress();
  const allTokens = await nftClient.tokens({ owner: user });
  const tokenInfos = [];
  for (const tokenId of allTokens.tokens) {
    const infoResponse = await nftClient.allNftInfo({ tokenId: tokenId });
    tokenInfos.push(infoResponse);
  }
  return tokenInfos;
};

export const addRecipientToQueue = async (
  caller: string,
  recipient: string
) => {
  const client = await getSigningClient();
  return await client.execute(
    await getAddress(),
    getContractAddr(),
    { add_recipient_to_queue: { caller: caller, recipient: recipient } },
    "auto"
  );
};

export const mintNft = async (recipient: string, token_uri: string) => {
  const client = await getSigningClient();
  const walletAddress = await getAddress();
  const nftClient = new NftGeneratorQueryClient(client, getNftContractAddr());
  const totalTokens = (await nftClient.numTokens()).count;
  if (!recipient) {
    console.log("recipient empty");
    return;
  }
  return await client.execute(
    walletAddress,
    getNftContractAddr(),
    {
      mint: {
        token_id: (totalTokens + 1).toString(),
        owner: recipient,
        token_uri: token_uri,
      },
    },
    "auto"
  );
};

export const useQueue = () => {
  const { data, error, mutate } = useSWR("/counter/queue", getQueue);
  return {
    count: data?.callerRecipient,
    error,
    addRecipientToQueue: (a: string, b: string) =>
      mutate(() => addRecipientToQueue(a, b)),
  };
};

export const useNftMintGetter = () => {
  const { data, error, mutate } = useSWR("/counter/nftsget", getNftFromUser);
  return {
    count: data,
    error,
  };
};

export const useNftMinter = () => {
  const { data, error, mutate } = useSWR("/counter/nftsmint");
  return {
    count: data,
    error,
    mint: (recipient: string, token_uri: string) =>
      mutate(() => mintNft(recipient, token_uri)),
  };
};
