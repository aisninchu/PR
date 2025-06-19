const fs = require("fs");
const path = __dirname + "/../../grpnmlock.json";

module.exports.config = {
  name: "grpnmlock",
  version: "1.0.0",
  role: 1,
  description: "Lock group name to a fixed value",
  usages: "/grpnmlock <group name> | off",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const input = args.join(" ");
  let lockData = {};

  // Load existing lock data
  if (fs.existsSync(path)) {
    lockData = JSON.parse(fs.readFileSync(path));
  }

  if (input.toLowerCase() === "off") {
    delete lockData[threadID];
    fs.writeFileSync(path, JSON.stringify(lockData, null, 2));
    return api.sendMessage("âœ… Group name lock disabled.", threadID);
  }

  // Lock the group name
  lockData[threadID] = input;
  fs.writeFileSync(path, JSON.stringify(lockData, null, 2));

  // Set the group name now
  api.setTitle(input, threadID, (err) => {
    if (err) return api.sendMessage("âŒ Failed to set group name.", threadID);
    return api.sendMessage(`ðŸ”’ Group name locked as: ${input}`, threadID);
  });
};

// Watcher to restore group name if changed
module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:thread-name") return;

  const threadID = event.threadID;
  if (!fs.existsSync(path)) return;

  const lockData = JSON.parse(fs.readFileSync(path));
  const lockedName = lockData[threadID];
  if (!lockedName) return;

  // Reset group name if it was changed
  if (event.logMessageData.name !== lockedName) {
    api.setTitle(lockedName, threadID);
  }
