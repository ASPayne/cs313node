import { Module } from "module";

function fetchQuery(querystring) {
    var query = document.getElementById('cardsearch').value;
    console.log('trying to query for ' + query);
    fetch('/scryfall/cardquery' + querystring, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) { throw response; }
            // fetch also returns a stream as the result...we have to tell it
            // how to format the stream...our choices are: json, text, or blob (binary data)
            return response.json();
            // the json() method also returns a promise...so we need
            //to call .then() on it as well (shown on the next line)
        })
        .then(function (data) {
            // we now have our data and can use it to update our page.
            //document.getElementById('cardSearchList').innerHTML = displaylist(data);
            return data;
        })
        .catch(err => {
            console.log(err);
        });
}

function createQueryString(params){
//temporarily returning one value in query
return '?cardnamesearch=' + params.cardName;
}

function scryfallQuery(queryparams){
    return fetchQuery(createQueryString(queryparams));
}

module.exports = {
    scryfallQuery: scryfallQuery
};