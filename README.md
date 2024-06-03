# SMMO web app alt trade tool extension
Tool to compare alt traded and returned items to make live of moderators easier.

Version: 0.0.1
Developed by Y0mu#0703

### Features:
- Currently only CONSOLE usage
- Retrieve items sent by specific user
- Compare stored items to get those that still need to be removed

### Requirements:
- Chromium browser

### Installation guide:
1. Download and unzip the extension.
2. Open your chrome browser and navigate to chrome://extensions/
3. At top right enable "Developer Mode"
4. At top left select "Load Unpacked"
5. Find the unzipped extension folder and load it.

### Usage:
If player with account A (993614) sent items from alt account B (1178418), then we would work like this:
**Before every alt trade, enter `resetItems();` into the console!**

How to get alt traded items:
- Open trade page of account A
- Find the first trade between the main (account A) and alt (account B)
- Open Console (CTRL+SHIFT+J/I)
- Enter `getItems(1178418, 993614);` into the console (1178418 - because the sender is the alt account B, 993614 - because the receiver is the main account A)
- Repeat the step above until you get all the traded items

How to get items traded sent to SMMOStaff:
- Find the first trade between the main (account A) and SMMOStaff (account C)
- Open Console (CTRL+SHIFT+J/I)
- Enter `getItems(993614, 575719);` into the console (993614 - because the sender is the main account A, 575719 - because the receiver is the SMMOStaff account C)
- Repeat the step above until you get all the traded items

How to compare the items and see what is still left or if there were more items sent to SMMOStaff:
- Open Console (CTRL+SHIFT+J/I)
- Enter `compareStoredItems(getStoredItems(1178418), getStoredItems(993614));` into the console (1178418 - because the first items are stored from the trades of alt account B, 993614 - because the second items are stored from the trades of main account A)
- See and review the printed results to determine whether it is enough or no.

### Functions:
```js
/**
 * Reset the stored items.
 * @returns void
 */
resetItems();
```

```js
/**
 * Get items from the current trade page.
 *
 * @param {string|int} sender user_id or name of the sender
 * @param {string|int|null} receiver user_id or name of the receiver
 * @returns void
 */
getItems(sender, receiver);
```

```js
/**
 * Get the stored items of the sender.
 * 
 * @param {int|string} sender 
 * @returns array of items the sender sent.
 */
getStoredItems(sender);
```

```js
/**
 * Compare the stored items of sender and then returned items to SMMO staff
 * to see if it was enough or how much is still missing.
 * @param {array} required_items items that the person sent to themselves.
 * @param {array} returned_items items that were sent to SMMOStaff.
 */
compareStoredItems(required_items, returned_items);

/**
 * Example:
 */
compareStoredItems(getStoredItems(sender_a), getStoredItems(sender_b));
```