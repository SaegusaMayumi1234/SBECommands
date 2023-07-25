import { getItemsData } from "./APIWrapper/Route";

function updateItemsData() {
    getItemsData().then(data => {
        if (data.error) return;
        const oldData = JSON.parse(FileLib.read('SBECommands', 'Constants/items.json'));
        if (oldData.lastUpdated !== data.lastUpdated) {
            FileLib.write('SBECommands', 'Constants/items.json', JSON.stringify(data, null, 4));
        }
    }).catch(error => {
        // just in case
    });
    setTimeout(() => {
        updateItemsData();
    }, 60 * 60 * 1000);
}

export { updateItemsData };