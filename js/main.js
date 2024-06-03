/**
 * Reset the stored items.
 * @returns void
 */
function resetItems() {
    console.log("Stored items have been cleared. Now you can start tracking next alt trading case.")
    localStorage.removeItem("stored_trade_items");
}

/**
 * Get items from the current trade page.
 *
 * @param {string|int} sender user_id or name of the sender
 * @param {string|int|null} receiver user_id or name of the receiver
 * @returns void
 */
function getItems(sender, receiver = null) {
    /**
     * Get the rows of the trade table.
     */
    let rows = document.querySelectorAll("tr");

    /**
     * Array to store the items.
     */
    let items = [];

    for (let i = 1; i < rows.length; i++) {
        /**
         * Skip if sender is not in the row's sender column.
         */
        if (!rows[i].children[0].innerHTML.includes(sender)) continue;

        /**
         * Skip if receiver is null or is not in the row's receiver column.
         */
        if (receiver !== null && !rows[i].children[1].innerHTML.includes(receiver))
            continue;

        /**
         * Get the id of the item.
         */
        let id = parseInt(
            rows[i].children[2].innerHTML.split("retrieveItem(")[1].split(",")[0]
        );

        /**
         * Get the name of the item.
         */
        let name = rows[i].children[2].innerText;

        /**
         * Get the quantity of the itme.
         */
        let quantity = parseInt(rows[i].children[3].innerText);

        /**
         * Add the item to the array.
         */
        items.push({
            id: id,
            name: name,
            quantity: quantity,
        });
    }

    if (!items.length) 
        return console.log("%c📙 This page has no traded between the sender and receiver", 'background: #676900; color: #fff786');

    storeItems(sender, items);
}

/**
 * Store the items from the trade page.
 *
 * @param {string|int} sender user_id or name of the sender
 * @param {array} items items the sender sent
 */
function storeItems(sender, items) {
    /**
     * Get the stored items.
     */
    let stored_trade_items = localStorage.getItem("stored_trade_items");

    /**
     * If empty then make it into an array.
     */
    stored_trade_items =
        stored_trade_items !== null && stored_trade_items !== undefined
            ? JSON.parse(stored_trade_items)
            : [];

    /**
     * Get the sender's index from the stored_trade_items.
     */
    let sender_index = stored_trade_items.findIndex((x) => x.sender === sender);

    /**
     * Set the stored items.
     */
    let stored_items = [];

    /**
     * If the sender already exists then update the stored_items.
     */
    if (sender_index !== -1) {
        /**
         * Get the stored items of the sender.
         */
        stored_items = stored_trade_items[sender_index].items;
    }

    /**
     * Loop the submitted items.
     */
    items.forEach((item) => {
        console.log(item);
        /**
         * Find index of the item in the already stored items.
         */
        let index = stored_items.findIndex((x) => x.id === item.id);

        /**
         * If the item is already stored then increase the quantity.
         */
        if (index !== -1) {
            stored_items[index].quantity += item.quantity;
            return;
        }

        /**
         * If the item does not exist then push it to the stored_items array.
         */
        stored_items.push(item);
    });

    /**
     * If the sender already exists then update the stored_items.
     */
    if (sender_index !== -1) {
        /**
         * Set the stored items of the sender.
         */
        stored_trade_items[sender_index].items = stored_items;
    } else {
        /**
         * Updated the sender's items in the stored_trade_items.
         */
        stored_trade_items.push({
            sender: sender,
            items: stored_items,
        });
    }

    /**
     * Save the items.
     */
    localStorage.setItem(
        "stored_trade_items",
        JSON.stringify(stored_trade_items)
    );
}

/**
 * Get the stored items of the sender.
 * 
 * @param {int|string} sender 
 * @returns array of items the sender sent.
 */
function getStoredItems(sender){
    /**
     * Get the stored items.
     */
    let stored_trade_items = localStorage.getItem("stored_trade_items");

    if (stored_trade_items === null || stored_trade_items === undefined)
            return console.warn("No stored items from the sender");
    
    /**
     * Parse the string of stored_trade_items.
     */
    stored_trade_items = JSON.parse(stored_trade_items);

    /**
     * Get the sender's index from the stored_trade_items.
     */
    let sender_index = stored_trade_items.findIndex((x) => x.sender === sender);

    return stored_trade_items[sender_index].items;
}

/**
 * Compare the stored items of sender and then returned items to SMMO staff
 * to see if it was enough or how much is still missing.
 * @param {array} required_items items that the person sent to themselves.
 * @param {array} returned_items items that were sent to SMMOStaff.
 */
function compareStoredItems(required_items, returned_items) {
    let missing_items = [];

    /**
     * Loop the submitted items.
     */
    returned_items.forEach((returned_item) => {
        /**
         * Find index of the item in the already stored items.
         */
        let index = required_items.findIndex((x) => x.id === returned_item.id);

        /**
         *  If the returned item exists in the required_items array then subtract it.
         */
        if (index !== -1) {
            required_items[index].quantity -= returned_item.quantity;
            return;
        }

        /**
         * If the item has not been returned then store it in missing items.
         */
        missing_items.push(returned_item);
    });


    /**
     * Get the items that were send but were not required.
     */
    let additional_items = returned_items.filter((returned_item) => {
        return returned_item.quantity > 0;
    });


    
    /**
     * Get the items that are still required to be send.
     */
    let not_enough_items = required_items.filter((required_item) => {
        return required_item.quantity > 0;
    });

     /**
     * Print missing items.
     */
    console.log("%c📕 Player has not returned:", 'background: #690007; color: #ff8686');
    missing_items.forEach((missing_item) => {
        console.log(missing_item.quantity + "x " + missing_item.name + " [id: " + missing_item.id + "]" );
    });

    /**
     * Print items that were not sent in full quantity.
     */
    console.log("%c📙 Player has returned, but the quantity below is still missing:", 'background: #676900; color: #fff786');
    not_enough_items.forEach((missing_item) => {
        console.log(missing_item.quantity + "x " + missing_item.name + " [id: " + missing_item.id + "]" );
    });

    /**
     * Print additional items.
     */
    console.log("%c📗 Player has added to the returned list:", 'background: #276900; color: #a2ff86');
    additional_items.forEach((missing_item) => {
        console.log(missing_item.quantity + "x " + missing_item.name + " [id: " + missing_item.id + "]" );
    });
}


/**
 * Print text of items of sender.
 * @param {int|string} sender 
 */
function printItems(sender) {
    let stored_items = getStoredItems(sender);

    stored_items.forEach((item) => {
        text += item.quantity + "x " + item.name + "(" + item.id + ")" + "\n";
    });

    console.log(text);
}
