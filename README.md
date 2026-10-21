# DaisyDing — static GitHub Pages storefront

A responsive storefront for a compact personal safety alarm. Built with plain HTML, CSS and JavaScript. The provided product images and short MP4 demo are in `assets/` and are loaded locally so they work on GitHub Pages.

## Store contents

- Bundle options: 1 pack — **$39.99**, 2 pack — **$71.98**, 3 pack — **$101.97**.
- Bundle selector with per-unit price and savings, add-to-cart, cart drawer and subtotal.
- Product gallery using the product images supplied in the chat.
- Embedded product demo video (`assets/daisyding-demo.mp4`).
- Product feature gallery, delivery estimate, 7-day returns/refunds and FAQ sections.
- No customer name/email/phone/address fields, login, newsletter, or contact form. The browser stores only the selected cart bundles and quantities in local storage.

## Set up PayPal checkout before launch

The three seller-provided PayPal checkout links are already configured in `script.js`:

- 1 pack — $39.99: `https://www.paypal.com/ncp/payment/NHVNH4DAANLZG`
- 2 pack — $71.98: `https://www.paypal.com/ncp/payment/32BFMGAF328X2`
- 3 pack — $101.97: `https://www.paypal.com/ncp/payment/QFSWZ9DV2NE8N`

Selecting **Checkout** redirects to the fixed-price link for the selected bundle. The cart's **Continue to secure checkout** button does the same when the cart contains a single bundle line with quantity 1. Do not use the same fixed-price invoice URL for all three bundles unless it is configured to charge the matching amount.

This is a static redirect, not a payment processor. It does not dynamically transmit the cart contents to PayPal or process payment on the site. Checkout requires one bundle in the bag at a time; multiple bundle quantities or mixed bundle lines need a correctly priced combined invoice/link or a fuller PayPal Checkout integration.

### Payment-method accuracy

The website includes a visual payment-options panel for PayPal, Apple Pay, card brands and Venmo, with a clear note that availability varies and PayPal displays the actual options for that link/location. Cash App and Zelle are visually marked as not connected because these PayPal links do not activate those independent payment methods. PayPal's own documentation says Payment Links support PayPal, Pay Later, Venmo, Apple Pay and major debit/credit cards, with availability varying by region and settings. PayPal/card options depend on the merchant setup and buyer eligibility.

## Shipping and returns policy shown

- Estimated delivery: about one week (actual timing can vary by dispatch, destination and carrier).
- Return/refund requests: within 7 days of delivery, initiated through order/PayPal invoice correspondence.

Review these customer-facing terms and make sure they match your actual fulfilment process and applicable requirements before accepting orders.

## Important product specification note

The site reproduces the product images provided in the chat. Some supplied graphics show different alarm sound ratings (130 dB and 135 dB), and one graphic claims up to two years of standby. The storefront therefore tells customers to confirm the exact model and specifications rather than presenting these conflicting supplier graphics as independently verified.

A fabricated “124 people bought in the last 24 hours” counter is not included. Use real, verifiable sales figures if you later add a sales counter. The site uses the exact bundle savings instead.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `daisyding-store`.
2. Upload the **contents** of this folder to the repository root: `index.html`, `styles.css`, `script.js`, `assets/`, and `README.md`.
3. In the repository, open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Open the deployed URL shown in the Pages settings.

No build step or Node.js installation is needed.
