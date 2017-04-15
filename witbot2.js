
 Wit = require('node-wit').Wit;
 interactive = require('node-wit').interactive;
//const parser = require('./parser');
var moviesTodayFile = 'moviesToday.json'
const fs = require("fs");
var jsonfile = require('jsonfile')

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/basic.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
        console.log('user said...', request.text);
        console.log('sending...', JSON.stringify(response));
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

        console.info(result.cinemas[0].name);
        console.info(result.cinemas[0].sessions[0]);
        context.theater = result.cinemas[0].name;
        context.showTime = result.cinemas[0].sessions[0];

        return resolve(context);
      });
    }
};

const client = new Wit({accessToken, actions});
interactive(client);


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
