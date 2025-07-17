
import basicSetup from '../wallet-setup/basic.setup';
import { metaMaskFixtures, MetaMask } from '@synthetixio/synpress/playwright';
import { testWithSynpress } from '@synthetixio/synpress';

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test;

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page, context, metamaskPage, extensionId }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  const metaMask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);

  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: 'visible',
    timeout: 30000
  })
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metaMask.connectToDapp();

  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH"
  }
  await metaMask.addNetwork(customNetwork);

  await expect(page.getByText("Token Address")).toBeVisible()
});
