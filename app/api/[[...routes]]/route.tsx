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
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response"
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`
            : "Welcome!"}
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target="/mint">Mint</Button.Transaction>,
      <TextInput placeholder="Leave a comment..." />,
      <Button.Link href="https://song.camp">Listen on song.camp</Button.Link>,

      status === "response" && <Button.Reset>Reset</Button.Reset>,
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
      1,
      1,
      encodedArguments,
      // `0x000000000000000000000000${truncatedAddress}00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000`,
      "0xF6019eA4Bfe5A45520940f3A6D98731eD7ae963c",
    ],
    value: parseEther("0.000777", "wei"),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);