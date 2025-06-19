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

  if (fs.existsSync(path)) {
    lockData = JSON.parse(fs.readFileSync(path));
  }

  if (input.toLowerCase() === "off") {
    delete lockData[threadID];
    fs.writeFileSync(path, JSON.stringify(lockData, null, 2));
    return api.sendMessage("✅ Group name lock disabled.", threadID);
  }

  lockData[threadID] = input;
  fs.writeFileSync(path, JSON.stringify(lockData, null, 2));

  api.setTitle(input, threadID, (err) => {
    if (err) return api.sendMessage("❌ Failed to set group name.", threadID);
    return api.sendMessage(`🔒 Group name locked as: ${input}`, threadID);
  });
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:thread-name") return;

  const threadID = event.threadID;
  if (!fs.existsSync(path)) return;

  const lockData = JSON.parse(fs.readFileSync(path));
  const lockedName = lockData[threadID];
  if (!lockedName) return;

  if (event.logMessageData.name !== lockedName) {
    api.setTitle(lockedName, threadID);
  }
};
