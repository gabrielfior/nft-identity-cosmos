import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useNftMinter, useNftMintGetter, useQueue } from "../api/counter";
import styles from "../styles/Home.module.css";
import { useForm } from "@mantine/form";
import { useToasts } from "react-toast-notifications";
import {
  Box,
  Button,
  Card,
  Stack,
  Group,
  Image,
  Space,
  Text,
  Divider,
  Textarea,
  TextInput,
  Title,
  Grid,
  SimpleGrid,
  Badge,
  Blockquote,
} from "@mantine/core";
import { encryptStringWithRsaPublicKey } from "../utils/crypto";
import { fetchLensProfileType, fetchOsmosisProfile } from "../api/backend";

export async function getStaticProps() {
  return { props: { key1: process.env.KEY1, key2: process.env.KEY2 } };
}

interface Props {
  key1: string;
  key2: string;
}

const Home: NextPage<Props> = (props) => {
  const { addToast } = useToasts();
  const {
    count: callerRecipient,
    error: error2,
    addRecipientToQueue,
  } = useQueue();
  const { count: nfts, error: error3 } = useNftMintGetter();
  const { error: error4, mint } = useNftMinter();
  const [isLoading, setLoading] = useState(false);
  const [osmosisProfile, setOsmosisProfile] = useState("");
  const [lensProfile, setLensProfile] = useState("");

  const form = useForm({
    initialValues: {
      secretWallet: "",
      encryptedSecretWallet: "",
      profileId: "",
      encryptedProfileId: "",
      recipient: "",
    },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Identity</title>
        <meta name="description" content="NFT Identity dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Title order={1}>NFT Identity protocol</Title>{" "}
        <Text td="underline" c="black">
          Mint NFTs for your wallet without doxxing yourself.
        </Text>
        <Text>Built using Cosmos, Neutron and Osmosis.</Text>
        <Divider my="xs" />
        <Grid>
          <Grid.Col span={4}>
            <Blockquote icon={""}>
              Step 1 - Enter wallet address (will remain secret through
              encryption) and a recipient which will receive the NFT.
              Optionally, enter your lens profile ID (will also remain secret).
            </Blockquote>
            <Box maw={320} mx="auto">
              <TextInput
                label="Secret wallet"
                size={"xl"}
                placeholder="Name"
                onChange={(e) => {
                  if (e.target.value === "") {
                    form.setValues({
                      secretWallet: e.target.value,
                      encryptedSecretWallet: "",
                    });
                  } else {
                    form.setValues({
                      secretWallet: e.target.value,
                      encryptedSecretWallet: encryptStringWithRsaPublicKey(
                        e.target.value,
                        props.key1,
                        props.key2
                      ),
                    });
                  }
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
                label="Lens Profile ID"
                size={"xl"}
                placeholder="Profile id"
                onChange={(e) => {
                  if (e.target.value === "") {
                    form.setValues({
                      profileId: e.target.value,
                      encryptedProfileId: "",
                    });
                  } else {
                    form.setValues({
                      profileId: e.target.value,
                      encryptedProfileId: encryptStringWithRsaPublicKey(
                        e.target.value,
                        props.key1,
                        props.key2
                      ),
                    });
                  }
                }}
                value={form.values.profileId}
              />
              <TextInput
                disabled={true}
                size={"xl"}
                label="Encrypted profile ID"
                {...form.getInputProps("encryptedProfileId")}
                placeholder="0x"
              />
              <TextInput
                mt="md"
                label="Recipient"
                size={"xl"}
                placeholder="Recipient"
                {...form.getInputProps("recipient")}
              />
            </Box>
          </Grid.Col>

          <Grid.Col span={4}>
            <Blockquote icon={""}>
              Step 2 - Add encrypted wallet and recipient to smart contract
              queue.
            </Blockquote>
            <Button
              size={"xl"}
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

            <Space h="md"></Space>
            <Title order={3} color={"blue.5"}>
              Smart contract queue
            </Title>
            <Space h="md"></Space>

            <SimpleGrid cols={2}>
              {callerRecipient?.map((obj, index) => {
                return (
                  <div key={index} style={{ maxWidth: "350px" }}>
                    <Card radius={"sm"} withBorder wid>
                      <Card.Section>
                        <Text size="sm" color="black">
                          Encrypted wallet address - {obj[0]} |
                        </Text>
                        <Text size="sm" color="gray">
                          Recipient - {obj[1]}
                        </Text>
                      </Card.Section>
                    </Card>
                  </div>
                );
              })}
            </SimpleGrid>
          </Grid.Col>
          <Grid.Col span={4}>
            <Blockquote icon={""}>
              Step 3 - Derive NFT tags for Osmosis and/or Lens and mint NFTs to
              the recipient.
            </Blockquote>
            <Stack h={250}>
              <Button
                size={"xl"}
                disabled={form.values.secretWallet === ""}
                onClick={async () => {
                  const profile = await fetchOsmosisProfile(
                    encryptStringWithRsaPublicKey(
                      form.values.secretWallet,
                      props.key1,
                      props.key2
                    )
                  );
                  setOsmosisProfile(profile);
                }}
              >
                Derive Osmosis profile
              </Button>

              <Textarea
                label={"Osmosis profile"}
                size={"xl"}
                value={osmosisProfile}
                disabled
              />

              <Button
                size={"xl"}
                disabled={form.values.encryptedSecretWallet === ""}
                onClick={async () => {
                  setLoading(true);
                  if (!form.values.recipient) {
                    addToast("Please set a recipient", {
                      appearance: "error",
                      autoDismiss: true,
                    });
                    return;
                  }
                  await mint(form.values.recipient, osmosisProfile);
                }}
              >
                Mint Osmosis NFT
              </Button>
            </Stack>

            <Divider variant={"solid"} my="xl" />

            <Stack h={250}>
              <Button
                size={"xl"}
                disabled={form.values.profileId === ""}
                onClick={async () => {
                  const lensProfile = await fetchLensProfileType(
                    encryptStringWithRsaPublicKey(
                      form.values.profileId,
                      props.key1,
                      props.key2
                    )
                  );
                  setLensProfile(lensProfile);
                }}
              >
                Derive Lens profile
              </Button>
              <Textarea
                label={"Lens profile"}
                size={"xl"}
                value={lensProfile}
                disabled
              />

              <Button
                size={"xl"}
                disabled={form.values.encryptedProfileId === ""}
                onClick={async () => {
                  if (!form.values.recipient) {
                    addToast("Please set a recipient", {
                      appearance: "error",
                      autoDismiss: true,
                    });
                    return;
                  }
                  await mint(form.values.recipient, lensProfile);
                }}
              >
                Mint Lens NFT
              </Button>
            </Stack>

            <Space h="md" />

            <Space h="md" />
          </Grid.Col>
        </Grid>
        <Space h="xl" />
        <Space h="xl" />
        <Title>NFT Gallery</Title>
        <Space h="xl" />
        <SimpleGrid cols={3}>
          {nfts?.map((name, index) => (
            <div>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="apart" mt="md" mb="xl">
                  <Text weight={500}>NFT type - {name.info.token_uri}</Text>
                  <Card.Section>
                    {name.info.token_uri?.toLowerCase() === "whale" ? (
                      <Image
                        src="https://pbs.twimg.com/media/FQisjXUXsAcspaA?format=jpg&name=4096x4096"
                        height={160}
                        alt="Norway"
                      />
                    ) : (
                      <p></p>
                    )}
                    {name.info.token_uri?.toLowerCase() === "crab" ? (
                      <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI_v3oYCqfT_9NnNUzhVv6gctYmn2cT8R7jGCVeKPXrXUQn1EfecXBKyMFjYJAFuXxDXE"
                        height={160}
                        alt="Norway"
                      />
                    ) : (
                      <p></p>
                    )}
                    {name.info.token_uri?.toLowerCase() === "influencer" ? (
                      <Image
                        src="https://images.unsplash.com/photo-1603217039863-aa0c865404f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
                        height={160}
                        alt="Norway"
                      />
                    ) : (
                      <p></p>
                    )}
                  </Card.Section>
                </Group>
                <Text size="sm" color="dimmed">
                  Owner - {name.access.owner}
                </Text>
              </Card>
            </div>
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
};

export default Home;
