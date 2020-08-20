var express = require('express');
var app = express();

const { Worker } = require('worker_threads');
const { StaticPool } = require("node-worker-threads-pool");

const pool = new StaticPool({
  size: 4,
  task: './worker.js',
  workerData: "workerData!",
});

app.get('/', function (req, res) {
  res.send('Worker thread!');
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function createWorker (delaySecond,callback) {
  const worker = new Worker('./worker.js');
  worker.on('error', (err) => { throw err });
  worker.on('message',  callback);
  worker.postMessage({ delay:delaySecond } );
}
