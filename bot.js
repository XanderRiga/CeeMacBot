const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: "CeeMacBot",
    password: ""
  },
  channels: [
    "CeeMac"
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  console.log(`* Attempting to execute ${commandName} command`);
  // If the command is known, let's execute it
  switch (commandName) {
    case '!dice':
      rollDice(target);
      break;
    default:
      console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice (target) {
  var roll = Math.floor(Math.random() * 6) + 1;
  client.say(target, `You rolled a ${roll}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}