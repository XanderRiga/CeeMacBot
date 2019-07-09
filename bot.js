const tmi = require('tmi.js');
const rp = require('request-promise');
const $ = require('cheerio');
const htt = require('cheerio-html-to-text');
const dotenv = require('dotenv');

dotenv.config();

// Define configuration options
const opts = {
  identity: {
    username: "CeeMacBot",
    password: process.env.PASSWORD
  },
  channels: [
    "CeeMac"
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

const rank_url = "https://mlb19.theshownation.com/universal_profiles/CeeMacTTV/online";

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

  if (!commandName.startsWith('!')) {
    return;
  }

  console.log(`* Attempting to execute ${commandName} command`);
  // If the command is known, let's execute it
  switch (commandName) {
    case '!dice':
      rollDice(target);
      break;
    case '!rating':
      rating(target);
      break;
    case '!dinger':
      dinger(target);
      break;
    default:
      console.log(`* Unknown command ${commandName}`);
  }
}

function dinger(target) {
  let response = dinger_strings()[Math.floor(Math.random() * dinger_strings().length)];
  client.say(target, response);
}

// Function called when the "rank" command is issued
function rating(target) {
  rp(rank_url)
    .then(html => {
      const html_text = htt.convert(html);
      index = html_text.lastIndexOf("Fort Worth") + 10;

      let rating = html_text.substring(
        index,
        index + 5
      );
      rating = rating.split(' ').join('');
      client.say(target, `CeeMac is currently in ${getRankName(rating)}, his rating is: ${parseInt(rating)}`);
    }).catch(err => {
      console.log(`error while getting rank: ${err}`);
      client.say(target, `Whoops, something went wrong getting CeeMac's rank. Please try again later.`);
    })
}

function getRankName(rating) {
  switch (true) {
    case rating >= 900:
      return 'World Series';
      break;
    case rating >= 800:
      return 'Championship Series';
      break;
    case rating >= 700:
      return 'Division Series';
      break;
    case rating >= 600:
      return 'Wild Card';
      break;
    case rating >= 500:
      return 'Pennant Race';
      break;
    case rating >= 400:
      return 'All Star';
      break;
    default:
      return 'Garbage Tier'
  }
}

function dinger_strings() {
  return [
    "HE HITS IT HIGHHHHHH, HE HITS IT DEEEEEEEP. IT. IS. OUTTA HERE!!!",
    "BACK BACK BACK BACK BACK BACK GONE!!",
    "JESUS CHRIST! IS THAT GUY ON ROIDS??",
    "That one is heading to splash city!!!",
    "HE MUST BE HITTING LEAVES CUZ THIS MAN IS RAKING"
  ]
}

// Function called when the "dice" command is issued
function rollDice (target) {
  let roll = Math.floor(Math.random() * 6) + 1;
  client.say(target, `You rolled a ${roll}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}