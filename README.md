# SMMO web app alt trade tool extension
Tool to compare alt traded and returned items to make life of moderators easier.

Version: 0.2.3

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
If player with account A sent items from alt account B to their main account A, then we would work like this:

**Before new alt trading case, enter `resetItems();` once into the console!**

How to get alt traded items:
- Step 1: Open trade page of account A
- Step 2: Find the first trade between the main (account A) and alt (account B)
- Step 3: Open Console (CTRL+SHIFT+J/I)
- Step 4: Enter `getItems("account A", "account B");` into the console (first is account that received the items, second is account that sent the items)
- Step 5: Go to the next trade page
- Step 6: Repeat from step 4 until you go through all trade pages

How to get items traded sent to SMMOStaff:
- Step 1: Find the first trade between the main (account A) and SMMOStaff (account C)
- Step 2: Open Console (CTRL+SHIFT+J/I)
- Step 3: Enter `getItems("account C", "account A", false);` into the console (first is account that received the items, second is account that sent the items, false because there is no "suspicious trade")
- Step 5: Go to the next trade page
- Step 6: Repeat from step 4 until you go through all trade pages

How to compare the items and see what is still left or if there were more items sent to SMMOStaff:
- Step 1: Open Console (CTRL+SHIFT+J/I)
- Step 2: Enter `compareStoredItems(getStoredItems("account A"), getStoredItems("account B"));` into the console  (first are alt traded items, second is returned items to staff)
- Step 3: See and review the printed results to determine whether it is enough or no.

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
 * @param {string|int} receiver user_id or name of the receiver.
 * @param {string|int|null|array} senders sender or [list of senders] (name, id).
 * @param {bool} failed_check_only whether we should count only trades that are suspicious.
 * @returns void
 */
getItems(receiver, senders, failed_check_only = true);
```

```js
/**
 * Get the stored items of the receiver.
 *
 * @param {int|string} receiver
 * @returns array of items the receiver received.
 */
getStoredItems(receiver);
```

```js
/**
 * Compare the stored items of receiver and then returned items to SMMO staff
 * to see if it was enough or how much is still missing.
 *
 * @param {array} required_items items that the person sent to themselves.
 * @param {array} returned_items items that were sent to SMMOStaff.
 * @returns void
 */
compareStoredItems(required_items, returned_items);

/**
 * Example:
 */
compareStoredItems(getStoredItems(receiver_a), getStoredItems(receiver_b));
```

```js
/**
 * Print text of items of the receiver.
 * @param {int|string} receiver 
 */
printItems(receiver);
```

### Additional examples

```js
/**
 * Situation when multiple accounts are returning to Staff account.
 * 
 * @param receiver
 * @param senders
 * @param failed_check_only - We have to disable this (set to false), 
 * because trades to Staff account are not market as suspicious.
 */
getItems("SMMOStaff", ["Account 1", "Account 2"], false);
```