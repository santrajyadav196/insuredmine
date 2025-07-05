const schedule = require("node-schedule");
const Message = require("../models/message.model");

function scheduleSingleMessage(messageDoc) {
  const runAt = new Date(messageDoc.scheduledAt);

  schedule.scheduleJob(runAt, () => {
    console.log(`Scheduled Message Executed: ${messageDoc.message}`);
  });

  console.log(`Scheduled message "${messageDoc.message}" on ${runAt}`);
}

async function scheduleAllMessages() {
  const allMessages = await Message.find({
    scheduledAt: { $gt: new Date() },
  });

  allMessages.forEach(scheduleSingleMessage);
}

module.exports = { scheduleSingleMessage, scheduleAllMessages };
