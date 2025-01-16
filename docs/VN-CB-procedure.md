# How to Perform Sovendus Integration Tests

1. Install the Sovendus Self-Test Extension by following the provided instructions.
2. Perform two tests: one on Desktop Chrome (with rejected cookies) and one on Mobile Chrome, following the instructions below.

## How to Perform a Test on Desktop Chrome

1. Place an order on your store using the Chrome browser (on Linux, Mac, or Windows) with cookies rejected. Also make sure to use any voucher code for the order, as we need to check if it gets passed on properly.
2. If there is a trace of our integration, the self-test overlay will open automatically on the page, displaying all order, consumer, and integration information.
3. Make sure the Sovendus Checkout Benefits offer list and Voucher Network are visible on the page where they should be.
4. Now check all values and potential error messages in the self-test overlay. Make sure to follow the steps you'll see when you hover over the info icons next to the values to verify them. In case there are any red error messages, follow the steps to fix them.
5. Repeat the steps above until all errors are resolved, and then send the test result to your account manager as described below.
6. To copy the test result to your clipboard, click on the Sovendus icon in the top right corner (if you can't see the Sovendus icon, click on the puzzle icon), and then click on "Copy Test Result." Wait and don't click out of the browser until the button changes color to green. This will create a screenshot of the page, including all information about the integration for your account manager. You can then navigate to your email program and paste the screenshot into the email using "Ctrl + V" on your keyboard (or right-click and then paste). **When sending the test results, please specify whether cookies were rejected or accepted.**

## How to Perform a Test on Mobile Chrome

1. Right-click on a random spot on the website and select "Inspect."
2. A pop-up should appear. In the top left corner of this pop-up, there should be an icon that looks like a notebook with a phone in front of it. Click on this icon. ![Mobile symbol image](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Integration-Selftester-Browser-Plugin/main/docs/Mobilesymbol-image.png)
3. The size of your page should now change. After that, click on "Dimensions: ..." at the top of your page and choose "iPhone 14 Pro Max."
4. After setting up the mobile mode, place another order on your store using the mobile platform, with cookies accepted. Also make sure to use any voucher code for the order, as we need to check if it gets passed on properly.
5. If there is a trace of our integration, the self-test overlay will open automatically on the page, displaying all order, consumer, and integration information.
6. Make sure the Sovendus Checkout Benefits offer list and Voucher Network are visible on the page where they should be.
7. Now check all values and potential error messages in the self-test overlay. Make sure to follow the steps you'll see when you hover over the info icons next to the values to verify them. In case there are any red error messages, follow the steps to fix them.
8. Repeat the steps above until all errors are resolved, and then send the test result to your account manager as described below.
9. To copy the test result to your clipboard, click on the Sovendus icon in the top right corner (if you can't see the Sovendus icon, click on the puzzle icon), and then click on "Copy Test Result." Wait and don't click out of the browser until the button changes color to green. This will create a screenshot of the page, including all information about the integration for your account manager. You can then navigate to your email program and paste the screenshot into the email using "Ctrl + V" on your keyboard (or right-click and then paste).

## The optimal result for your integration looks like this

![vn&cb-image](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Integration-Selftester-Browser-Plugin/main/docs/VN&CB.png)

## Additional Notes for Shopify App Users

The Shopify App (new version) is not yet recognized by the Self-Test Extension, and therefore no data will be displayed. Instead, please ensure that the integration is visible on the Thank You page.

## Example Image for Shopify App Integration

![Shopify-App-image](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Integration-Selftester-Browser-Plugin/main/docs/Shopify-App.png)
