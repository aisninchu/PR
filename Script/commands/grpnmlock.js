const fs = require("fs");
const path = __dirname + "/../lockdata.json"; // store locked names here

if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

module.exports.config = {
  name: "grpnmlock",
  version: "1.0.0",
  hasPermssion: 1, // Only admin/mod
  credits: "YourName",
  description: "Lock current group name",
  commandCategory: "Group",
  usages: "/grpnmlock [locked name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const lockedName = args.join(" ");
  if (!lockedName) return api.sendMessage("❌ Please enter a name to lock.", event.threadID, event.messageID);

  const data = JSON.parse(fs.readFileSync(path));
  data[event.threadID] = lockedName;

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  return api.sendMessage(`✅ Group name locked to: ${lockedName}\nIf someone changes it, I will revert it.`, event.threadID);
};
