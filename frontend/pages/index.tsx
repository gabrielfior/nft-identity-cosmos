import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { addRecipientToQueue, useCount, useQueue } from "../api/counter";
import styles from "../styles/Home.module.css";
import { useForm } from "@mantine/form";
import { TextInput, Button, Group, Box, Input } from "@mantine/core";
import { encryptStringWithRsaPublicKey } from "../utils/crypto";

export async function getStaticProps() {
  return { props: { key1: process.env.KEY1, key2: process.env.KEY2 } };
}

interface Props {
  key1: string;
  key2: string;
}

const Home: NextPage<Props> = (props) => {
  const { count, error: error1, increase } = useCount();
  const {
    count: callerRecipient,
    error: error2,
    addRecipientToQueue,
  } = useQueue();
  const [isLoading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      secretWallet: "",
      encryptedSecretWallet: "",
      recipient: "",
    },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Counter Dapp</title>
        <meta name="description" content="Counter dapp: an example dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Count</h1>

        <p>secret {form.values.secretWallet}</p>

        <Box maw={320} mx="auto">
          <TextInput
            label="Secret wallet"
            size={"xl"}
            placeholder="Name"
            onChange={(e) => {
              form.setValues({
                secretWallet: e.target.value,
                encryptedSecretWallet: encryptStringWithRsaPublicKey(
                  e.target.value,
                  props.key1,
                  props.key2
                ),
              });
            }}
            value={form.values.secretWallet}
          />
          <TextInput
            disabled={true}
            size={"xl"}
            label="Encrypted secret wallet"
            {...form.getInputProps("encryptedSecretWallet")}
            placeholder="0x"
          />
          <TextInput
            mt="md"
            label="Recipient"
            size={"xl"}
            placeholder="Recipient"
            {...form.getInputProps("recipient")}
          />

          <Group position="center" mt="xl">
            <Button
              variant="outline"
              onClick={async () => {
                setLoading(true);
                await addRecipientToQueue(
                  form.values.encryptedSecretWallet,
                  form.values.recipient
                );
                setLoading(false);
              }}
            >
              Add recipient to queue
            </Button>
          </Group>
        </Box>

        <p
          className={
            isLoading ? [styles.count, styles.pulse].join(" ") : styles.count
          }
        >
          {count === undefined ? "?" : count}
        </p>

        <h1 className={styles.title}>Queue</h1>
        <p
          className={
            isLoading ? [styles.count, styles.pulse].join(" ") : styles.count
          }
        >
          {callerRecipient === undefined
            ? "?"
            : JSON.stringify(callerRecipient)}
        </p>

        {error1 ? (
          <p className={styles.error}>Error: {error1.message}</p>
        ) : (
          <></>
        )}

        <div className={styles.grid}>
          <a
            className={styles.card}
            onClick={async () => {
              setLoading(true);
              await increase();
              setLoading(false);
            }}
          >
            <h2>＋ Increase Counter</h2>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
