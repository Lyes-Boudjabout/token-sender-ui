# Token Sender UI 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

You'll need a `.env.local` the following environment variables:

- `NEXT_PUBLIC_PROJECT_ID`: Project ID from [reown cloud](https://cloud.reown.com/)


### Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```bash
git clone https://github.com/Lyes-Boudjabout/token-sender-ui
cd token-sender-ui
pnpm install
pnpm run anvil
```

You'll want to make sure you have a Metamask/Rabby wallet connected to your anvil instance. Ideally you're connected to the wallet that comes with the default anvil instance. This will have some mock tokens in it.

Then, in a second browser run:

```bash
pnpm run dev
```

### tsender-deployed.json

The `tsender-deployed.json` object is a starting state for testing and working with the UI.

- TSender: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Mock token address: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (can use the `mint` or `mintTo` function)
- The anvil1 default address (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`) with private key `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` has some tokens already minted.

```solidity
    uint256 MINT_AMOUNT = 1e18;

    function mint() external {
        _mint(msg.sender, MINT_AMOUNT);
    }

    function mintTo(address to, uint256 amount) external {
        _mint(to, amount);
    }
```

## Tests

```bash
pnpm test:unit # unit tests
pnpm test:e2e # broken e2e tests
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!