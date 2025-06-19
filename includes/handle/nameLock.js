const fs = require("fs");
const path = __dirname + "/../../lockdata.json";

module.exports.config = {
    name: "nameLock",
    eventType: ["log:thread-name"]
};

module.exports.run = async function ({ api, event }) {
    if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

    const data = JSON.parse(fs.readFileSync(path));
    const lockedName = data[event.threadID];

    // If name is locked and someone changed it
    if (lockedName && event.logMessageData?.name !== lockedName) {
        try {
            await api.setTitle(lockedName, event.threadID);
            api.sendMessage(`⚠️ Group name is locked. Reverting to: ${lockedName}`, event.threadID);
        } catch (err) {
            console.log("❌ Error reverting group name:", err);
        }
    }
};
