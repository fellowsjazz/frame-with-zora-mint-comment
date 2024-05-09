/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { zora1155 } from "./zora1155.js";
import { encodeAbiParameters } from "viem";

const abi = zora1155;

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  browserLocation: "https://song.camp/",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

//comment and minter address encoding function:

const encodeArguments = (address: any, comment: any) => {
  const encodedParams = encodeAbiParameters(
    [
      { name: "mintTo", type: "address" },
      { name: "comment", type: "string" },
    ],
    [address, comment]
  );
  console.log(
    `encoded minter arguments [${address},${comment}].  result: `,
    encodedParams
  );

  return encodedParams;
};

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    action: "/mintsuccess",
    image:
      // "https://magic.decentralized-content.com/ipfs/bafkreig6tezfpz2byeeujnmxfdqfopcrn6cjqwesacxz767comiodkvlgi", tender
      // "https://magic.decentralized-content.com/ipfs/bafybeigk3nqaf3rrhsgr4e2pa5xhtz4j22l3bcz6xhkkdepf3mtlgtymli", // elouise
      // "https://drop-page.vercel.app/songcampAlumni.png",
      "https://frame-with-zora-mint-comment.vercel.app/initial.jpg",

    intents: [
      <Button.Transaction target="/mint">Mint</Button.Transaction>,
      <TextInput placeholder="Comment and tip $enjoy" />,
      <Button.Link href="https://song.camp/collection/0xa7f7368d3f27515844abacd452252a4bcf824317?tokenId=2">
        Listen
      </Button.Link>,
      // <Button value="test">test success</Button>,
    ],
  });
});

app.frame("/mintsuccess", (c) => {
  const { buttonValue, inputText, status } = c;
  const dummy = "dummy";
  return c.res({
    image:
      // "https://magic.decentralized-content.com/ipfs/bafkreig6tezfpz2byeeujnmxfdqfopcrn6cjqwesacxz767comiodkvlgi", tender
      // "https://magic.decentralized-content.com/ipfs/bafybeigk3nqaf3rrhsgr4e2pa5xhtz4j22l3bcz6xhkkdepf3mtlgtymli", // elouise
      // "https://drop-page.vercel.app/songcampAlumni.png",
      // "https://drop-page.vercel.app/songcampAlumni.png",
      // "https://drop-page.vercel.app/songcampAlumni.png",
      "https://frame-with-zora-mint-comment.vercel.app/submitted.jpg",

    intents: [
      <Button.Link href="https://song.camp/collection/0xa7f7368d3f27515844abacd452252a4bcf824317?tokenId=2">
        Listen
      </Button.Link>,
      <Button.Link href="https://65y914vyymr.typeform.com/to/t3bxerKY?typeform-source=frame">
        Release with Songcamp
      </Button.Link>,
    ],
  });
});

app.transaction("/mint", (c) => {
  const { buttonValue, inputText, status, address } = c;
  console.log("address: ", address);
  const truncatedAddress = address.toLowerCase().replace(/^0x/, "");
  console.log("truncated address: ", truncatedAddress);

  const encodedArguments = encodeArguments(address, inputText);

  return c.contract({
    abi,
    chainId: "eip155:8453",
    functionName: "mintWithRewards",
    // to: "0xa7f7368d3f27515844abacd452252a4bcf824317", elouise
    to: "0x014343327550ad974dccd6b3de77611b4fc7967b", //tender
    args: [
      "0x04E2516A2c207E84a1839755675dfd8eF6302F0a",
      2,
      1,
      encodedArguments,
      // `0x000000000000000000000000${truncatedAddress}00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000`,
      "0xa7f7368d3f27515844abacd452252a4bcf824317",
    ],
    value: parseEther("0.000777", "wei"),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
