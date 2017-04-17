var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var flatten = require('flat')

const fs = require("fs");
var jsonfile = require('jsonfile')



var START_URL = "https://www.afisha.ru/msk/schedule_cinema/";
var moviesTodayFile = 'moviesToday.json'

exports.findMoviesToday = function() {
  visitPage(START_URL);
}


  function visitPage(url) {
    console.log("VISITING PAGE: " + START_URL);

    // Make the request
    console.log("Visiting page " + url);
    request(url, function(error, response, body) {
      // Check status code (200 is HTTP OK)
      console.log("Status code: " + response.statusCode);
      if(response.statusCode !== 200) {
        console.log(error);
        return;
      }
      // Parse the document body
      var $ = cheerio.load(body);

      var m = searchForMovies($);

      fs.writeFile(moviesTodayFile, JSON.stringify(m, null, "  "), console.error);


      var result = m.filter(function( obj ) {
        return obj.title == 'Живое';
      });

      console.info(result);
      var json = result; //JSON.stringify(result, null, "  ");
      //console.info(JSON.stringify(result, null, "  "));
      //console.info(flatten(json));



    });
  }

    function searchForMovies($) {
        var movies = new Array();

        // EACH MOVIE
        $( '#schedule' ).children().each(function( index ) {
            var tit = $(this).find('div.m-disp-table').find('h3').text().trim();
            var sum = $(this).find('div.m-disp-table').find('p').text().trim();

            var t = $(this).clone().find('div.m-disp-table');
            t.find('p').remove().text();
            t.find('a').first().remove();
            var spec = t.text().trim();
            //console.log(spec);


            // EACH CINEMA
            var cins = new Array();
             $(this).find('tr').each(function( index ) {
            //$(this).find('td.b-td-item').each(function( index ) {

                var c = $(this).find('td.b-td-item').find('a').text();
                var ses = new Array();

                // EACH SESSION
                $(this).find('span').not('.title').each(function( index ) {
                     var s = $(this).text().trim();
                     ses.push(s);
                });

                var cin = {name: c, sessions: ses};

                cins.push(cin);
            });
            var movie = {id: index, title: tit, summary: sum, special:spec, cinemas:cins};
            movies.push(movie);
        });

        return movies;
  }
