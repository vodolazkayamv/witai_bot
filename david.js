//=================================
var parser = require('./parser');
var schedule = require('node-schedule');

var j = schedule.scheduleJob('21 * * * *', function(){
  parser.findMoviesToday();
  console.log('Scheduled database renewal!!!');
});


//==================================
// TELEGRAM BOT
const TeleBot = require('telebot');

const bot = new TeleBot({
  token: '336898369:AAH8Nu2ikWDShZ6ooOa8IULj_ri9lUBdJMg', // Required.
  sleep: 1000, // Optional. How often check updates (in ms).
  timeout: 0, // Optional. Update pulling timeout (0 - short polling).
  limit: 100, // Optional. Limits the number of updates to be retrieved.
  retryTimeout: 5000 // Optional. Reconnecting timeout (in ms).
});

/*
// test if bot receives text messages
bot.on('text', msg => {
  let fromId = msg.from.id;
  let firstName = msg.from.first_name;
  let reply = msg.message_id;
  return bot.sendMessage(fromId, `Welcome, ${ firstName }!`, { reply });
});
*/

bot.on(['/start'], msg => {
  let firstName = msg.from.first_name;
  return bot.sendMessage(msg.from.id, `Здравствуй, ${ firstName }! \nЯ бот модели David-1, моя задача - помогать человеку в поисках инфрмации о его прошлом и будущем.`);
});

bot.on(['text'], msg => {
  sessionId = msg.from.id;


  wit.runActions(sessionId, msg.text, context, steps)
    .then((ctx) => {
      context = ctx;
      //prompt(); // if any
    })
    .catch(err => console.error(err));
});

bot.connect();



//========================================================================
var moviesTodayFile = 'moviesToday.json'
const fs = require("fs");
var jsonfile = require('jsonfile')

const uuid = require('uuid');
let context = typeof initContext === 'object' ? initContext : {};
let sessionId = uuid.v1();
const steps = 1;
//========================================================================
Wit = require('node-wit').Wit;
//========================================================================
//WIT.AI BOT ACTIONS
const actions = {
 send(request, response) {
   const {sessionId, context, entities} = request;
   const {text, quickreplies} = response;
   return new Promise(function(resolve, reject) {
       console.log('user said...', request.text);
       console.log('sending...', JSON.stringify(response));

       bot.sendMessage(sessionId, response.text);
       return resolve();
   });
 },
 findCinema({sessionId, context, text, entities}) {
     console.log(`Session ${sessionId} received ${text}`);
     console.log(`The current context is ${JSON.stringify(context)}`);
     console.log(`Wit extracted ${JSON.stringify(entities)}`);
     return new Promise(function(resolve, reject) {
       const movie_title = firstEntityValue(entities, 'movie');
       if (movie_title) {
           context.movie = movie_title;
       }
       //call the API here
       context.showTime = 'tomorrow';
       context.theater = 'Cinemax';

       var db = jsonfile.readFileSync(moviesTodayFile);
       var result = db.find(function( obj ) {
         return obj.title == movie_title;
       });

       var cins = result.cinemas;
       var cin = "";
       for (var i = 0; i < 3; i++) {
         if (cins[i].name == "")
           continue;

         cin += cins[i].name + ', ';

       }
       cin += "и в " + cins.length + " других к/т";

       //console.info(result.cinemas[0].name);
       //console.info(result.cinemas[0].sessions[0]);
       //context.theater = result.cinemas[0].name;
       //context.showTime = result.cinemas[0].sessions[0];
       context.showTime = 'сегодня';
       context.theater = cin;

       console.info('CONTEXT:');
       console.info( context);
       return resolve(context);
     });
   }
};

// Setting up our bot
const wit = new Wit({
  accessToken: 'UYC42KJY3O4TSTSPBOCPVBJ5O42EYDVH',
  actions,
  //logger: new log.Logger(log.INFO)
});

//==================================================
// вспомогательные методы
//===================================================

//Extract an entity value from the entities returned by Wit
const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};
