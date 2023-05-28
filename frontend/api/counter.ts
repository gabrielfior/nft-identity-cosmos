import useSWR from "swr";
import { getAddress, getClient, getSigningClient } from "../lib/client";
import { getContractAddr } from "../lib/state";
import { CounterClient, CounterQueryClient } from "../contracts/Counter.client";

export const getCount = async () => {
  const client = await getClient();
  return await client.queryContractSmart(getContractAddr(), { get_count: {} });
};

export const getQueue = async () => {
  console.log("entered getQueue");
  const client = await getClient();
  return await client.queryContractSmart(getContractAddr(), {
    get_caller_recipient: {},
  });
  //return await new CounterQueryClient(client, getContractAddr()).getCallerRecipient();
};

export const increase = async () => {
  const client = await getSigningClient();
  return await client.execute(
    await getAddress(),
    getContractAddr(),
    { increment: {} },
    "auto"
  );
};

export const addRecipientToQueue = async (
  caller: string,
  recipient: string
) => {
  console.log("caller", caller, recipient, "recipient");
  const client = await getSigningClient();
  const sender = await getAddress();
  // return new CounterClient(client,sender,getContractAddr())
  //     .addRecipientToQueue({ caller: caller, recipient: recipient });
  return await client.execute(
    await getAddress(),
    getContractAddr(),
    { add_recipient_to_queue: { caller: caller, recipient: recipient } },
    "auto"
  );
};

export const useCount = () => {
  const { data, error, mutate } = useSWR("/counter/count", getCount);
  return {
    count: data?.count,
    error,
    increase: () => mutate(increase),
  };
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
