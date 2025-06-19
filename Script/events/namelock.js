const fs = require("fs");
const filePath = __dirname + "/../../lockdata.json";

module.exports.config = {
  name: "nameLock",
  eventType: ["log:thread-name"]
};

module.exports.run = async function ({ api, event }) {
  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath));
  const lockedName = data[event.threadID];

  if (lockedName && event.logMessageData?.name !== lockedName) {
    try {
      await api.setTitle(lockedName, event.threadID);
      api.sendMessage(
        `✅ Group name is locked to: ${lockedName}\n❌ Someone changed it, reverting.`,
        event.threadID
      );
    } catch (err) {
      console.log("❌ Error while reverting name:", err);
    }
  }
};
