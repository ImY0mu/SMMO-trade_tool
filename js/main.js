/**
 * Reset the stored items.
 *
 * @returns void
 */
function resetItems() {
    logSuccess(
        "Stored items have been cleared. Now you can start tracking next alt trading case."
    );
    localStorage.removeItem("stored_trade_items");
}

/**
 * Check whether the receiver is in the trade row.
 *
 * @param {string|int} receiver
 * @param {string} receiver_text
 * @returns boolean
 */
function isReceiverInTrade(receiver, receiver_text) {
    return receiver_text.includes(receiver);
}

/**
 * Check whether the senders are in the trade row.
 *
 * @param {array|string|int} senders
 * @param {string} sender_text
 * @returns boolean
 */
function areSendersInTrade(senders, sender_text) {
    if(senders == null)
        return true;

    if(!senders.length)
        return true;


    if (Array.isArray(senders)) {

        for (const sender of senders) {
            if (sender_text.includes(sender)) 
                return true;
        }

        return false;
    }

    return sender_text.includes(senders);
}

/**
 * Check whether the trade failed the suspicious check.
 *
 * @param {string} check_text
 * @returns boolen
 */
function hasFailedCheck(check_text) {
    return check_text.includes("View problem");
}

/**
 * Get the item object from the row.
 *
 * @param {string} row
 * @returns object
 */
function getItemFromRow(row) {
    let id = parseInt(
        row.children[2].innerHTML.split("retrieveItem(")[1].split(",")[0]
    );

    let name = row.children[2].innerText;

    let quantity = parseInt(row.children[3].innerText);

    return {
        id: id,
        name: name,
        quantity: quantity,
    };
}

/**
 * Log warn message.
 *
 * @param {string} message
 * @returns void
 */
function logWarn(message) {
    console.log(`%c📙 ${message}`, "background: #676900; color: #fff786");
}

/**
 * Log success message.
 *
 * @param {string} message
 * @returns void
 */
function logSuccess(message) {
    console.log(`%c📙 ${message}`, "background: #276900; color: #a2ff86");
}

/**
 * Log error message.
 *
 * @param {string} message
 * @returns void
 */
function logError(message) {
    console.log(`%c📙 ${message}`, "background: #690007; color: #ff8686");
}

/**
 * Log item message.
 * @param {object} item
 */
function logItem(item) {
    console.log(item.quantity + "x " + item.name + " [id: " + item.id + "]");
}

/**
 * Get items from the current trade page.
 *
 * @param {string|int} receiver user_id or name of the receiver.
 * @param {string|int|null|array} senders sender or list of senders (name, id).
 * @param {bool} failed_check_only whether we should count only trades that are suspicious.
 * @returns void
 */
function getItems(receiver = null, senders = null, failed_check_only = true) {
    /**
     * Get the rows of the trade table.
     */
    let rows = document.querySelectorAll("tr");

    /**
     * Array to store the items.
     */
    let items = [];

    for (let i = 1; i < rows.length; i++) {
        if (!isReceiverInTrade(receiver, rows[i].children[1].innerText))
            continue;

        if (isReceiverInTrade(receiver, rows[i].children[1].innerText) && !areSendersInTrade(senders, rows[i].children[0].innerText))
            continue;

        if (!hasFailedCheck(rows[i].children[5].innerText) && failed_check_only)
            continue;

        items.push(getItemFromRow(rows[i]));
    }

    if (!items.length)
        return logWarn("This page has no trades between the sender and receiver.");

    logSuccess(
        "All trades (" + items.length + ") from this page have been stored."
    );

    storeItems(receiver, items);
}

/**
 * Store the items from the trade page.
 *
 * @param {string|int} receiver user_id or name of the player who received the items.
 * @param {array} items items that were sent to re
 */
function storeItems(receiver, items) {
    let stored_trade_items = localStorage.getItem("stored_trade_items");

    stored_trade_items =
        stored_trade_items !== null && stored_trade_items !== undefined
            ? JSON.parse(stored_trade_items)
            : [];

    let receiver_index = stored_trade_items.findIndex(
        (x) => x.receiver === receiver
    );

    let stored_items = [];

    if (receiver_index !== -1) {
        stored_items = stored_trade_items[receiver_index].items;
    }

    items.forEach((item) => {
        let index = stored_items.findIndex((x) => x.id === item.id);

        if (index !== -1) {
            stored_items[index].quantity += item.quantity;
            return;
        }

        stored_items.push(item);
    });

    if (receiver_index !== -1) {
        stored_trade_items[receiver_index].items = stored_items;
    } else {
        stored_trade_items.push({
            receiver: receiver,
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
 * Get the stored items of the receiver.
 *
 * @param {int|string} receiver
 * @returns array of items the receiver received.
 */
function getStoredItems(receiver, manually_called = true) {
    let stored_trade_items = localStorage.getItem("stored_trade_items");

    if (stored_trade_items === null || stored_trade_items === undefined) {
        if (manually_called)
            logWarn("There are no items from this receiver in storage.");

        return [];
    }

    stored_trade_items = JSON.parse(stored_trade_items);

    let receiver_index = stored_trade_items.findIndex(
        (x) => x.receiver === receiver
    );

    if (receiver_index !== -1) return stored_trade_items[receiver_index].items;

    if (manually_called)
        logWarn("There are no items from this receiver in storage.");

    return [];
}

/**
 * Compare the stored items of receiver and then returned items to SMMO staff
 * to see if it was enough or how much is still missing.
 *
 * @param {array} required_items items that the person sent to themselves.
 * @param {array} returned_items items that were sent to SMMOStaff.
 * @returns void
 */
function compareStoredItems(required_items, returned_items) {
    if(!required_items.length)
        return logWarn("Required items are empty.");

    if(!returned_items.length)
        return logWarn("Returned items are empty.");

    let missing_items = [];

    console.log(required_items, returned_items);

    returned_items.forEach((returned_item) => {
        let index = required_items.findIndex((x) => x.id === returned_item.id);

        if (index !== -1) {
            required_items[index].quantity -= returned_item.quantity;
            return;
        }

        missing_items.push(returned_item);
    });

    let additional_items = returned_items.filter((returned_item) => {
        return returned_item.quantity > 0;
    });

    let not_enough_items = required_items.filter((required_item) => {
        return required_item.quantity > 0;
    });

    if(!missing_items.length){
        logSuccess("Player has returned all items.");
    }
    else{
        logError("Player has not returned:");
        missing_items.forEach((item) => {
            logItem(item);
        });
    }

    if(!not_enough_items.length){
        logSuccess("There are no quantities missing.");
    }
    else{
        logWarn("Player has returned, but the quantity below is still missing:");
        not_enough_items.forEach((item) => {
            logItem(item);
        });
    }

    if(!additional_items.length){
        logWarn("Player has not included any additional items.");
    }
    else{
        logSuccess("Player has added to the returned list:");
        additional_items.forEach((item) => {
            logItem(item);
        });
    }
}

/**
 * Print text of items of receiver.
 *
 * @param {int|string} receiver
 */
function printItems(receiver) {
    let text = "";
    let stored_items = getStoredItems(receiver, false);

    stored_items.forEach((item) => {
        text += item.quantity + "x " + item.name + "(" + item.id + ")" + "\n";
    });

    console.log(text);
}
