var express = require('express');
var app = express();
const request = require('request');
const util = require('util');

const promiseRequest = util.promisify(request);

const { Worker } = require('worker_threads');
const { StaticPool } = require("node-worker-threads-pool");

const pool = new StaticPool({
  size: 4,
  task: './worker.js',
  workerData: "workerData!",
});

const postData = {
  "currencyCode": "USD",
  "originDestinations": [
    {
      "id": "1",
      "originLocationCode": "RIO",
      "destinationLocationCode": "MAD",
      "departureDateTimeRange": {
        "date": "2021-02-01",
        "time": "10:00:00"
      }
    },
    {
      "id": "2",
      "originLocationCode": "MAD",
      "destinationLocationCode": "RIO",
      "departureDateTimeRange": {
        "date": "2021-02-05",
        "time": "17:00:00"
      }
    }
  ],
  "travelers": [
    {
      "id": "1",
      "travelerType": "ADULT"
    },
    {
      "id": "2",
      "travelerType": "CHILD"
    }
  ],
  "sources": [
    "GDS"
  ],
  "searchCriteria": {
    "maxFlightOffers": 2,
    "flightFilters": {
      "cabinRestrictions": [
        {
          "cabin": "BUSINESS",
          "coverage": "MOST_SEGMENTS",
          "originDestinationIds": [
            "1"
          ]
        }
      ],
      "carrierRestrictions": {
        "excludedCarrierCodes": [
          "AA",
          "TP",
          "AZ"
        ]
      }
    }
  }
};

app.get('/', function (req, res) {
  res.send('Healthy');
});

app.get('/hello', function (req, res) {
  res.send('Healthy');
});

app.get('/pre-post', function (req, res) {
  (async () => {
    const preProcessResponse = await pool.exec({type:'pre-process',input:'input'});
    var dataResponse = '';
    try{
      dataResponse = await promiseRequest({
      method: 'post',
      headers: {'content-type' : 'application/json','X-HTTP-Method-Override':'GET','Authorization':'Bearer hscAyKGQpCGWHKaH08ptWzutkkA7'},
      url:     'https://test.api.amadeus.com/v2/shopping/flight-offers',
      json:     postData
    });
    }catch(err){
      console.log(err);
    }
    const postProcessResposne = await pool.exec({type:'post-process',input:'input'});
   
    res.send(dataResponse);
  })();
});

app.get('/createWorker/:delaySecond', function (req, res) {
    createWorker(req.params.delaySecond,function(data){
      res.send('Waited Second(New worker) :'+data.wait);
    });
});

app.get('/pickWorker/:delaySecond', function (req, res) {
  (async () => {
    const data = await pool.exec({delay:req.params.delaySecond});
    res.send('Waited Second(Reused worker) :'+data.wait);
  })();
});

app.listen(3000,'0.0.0.0' ,function () {
  console.log('Example app listening on port 3000!');
});

function createWorker (delaySecond,callback) {
  const worker = new Worker('./worker.js');
  worker.on('error', (err) => { throw err });
  worker.on('message',  callback);
  worker.postMessage({ delay:delaySecond } );
}
