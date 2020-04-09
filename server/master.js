const cluster = require("cluster");
const os = require("os");
const WebSocket = require("ws");
let wssConnections = {};
let counter = 0;

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  //#region startup logs
  Object.values(cluster.workers).forEach((worker, i) =>
    console.log(`worker ${i} : `, worker.process.pid)
  );
  console.log("currently working on the platform: ", process.platform);
  console.log("working directory: ", process.cwd());
  console.log("cpus", cpuCount);
  //#endregion

  cluster.on("exit", handleWorkerExit);
  const wss = new WebSocket.Server({ port: 1337 });
  wss.on("listening", () => console.log("WSS listening on 1337"));
  wss.on("connection", handleWSSConnection);
} else {
  require("./servernode");
}

function handleWorkerExit(worker, code, signal) {
  if (code !== 0 && !worker.exitedAfterDisconnect) {
    console.log("worker crashed");
    cluster.fork();
    console.log("new worker created");
  }
}

function handleWSSConnection(wss) {
  wss.id = counter++;
  wssConnections[wss.id] = wss;
  wss.on("message", function incoming(message) {
    const jsonmsg = JSON.parse(message);
    const currentConnection = wssConnections[wss.id];
    if (!currentConnection.name) {
      currentConnection.name = jsonmsg.username;
      sendUserJoined(wss.id);
    } else {
      sendAll(jsonmsg.message, wss.id);
    }
  });
}

function sendUserJoined(Id) {
  for (let i = 0; i < Object.keys(wssConnections).length; i++) {
    const wssConnection = wssConnections[i];
    if (Id !== wssConnection.id) {
      wssConnection.send(
        JSON.stringify({
          username: wssConnections[Id].name,
          message: "new join",
        })
      );
    }
  }
}

function sendAll(message, Id) {
  const username = wssConnections[Id].name;
  for (let i = 0; i < Object.keys(wssConnections).length; i++) {
    const wssConnection = wssConnections[i];
    // if (Id !== wssConnection.id) {
    wssConnection.send(
      JSON.stringify({ username: username, message: message })
    );
    // }
  }
}

//#region set up a single tcp server
//   require("./tcpchatserver");
/*
    this will be a server that is created once while the loads for the http will be 
    distributed accross the x created processes 
  */
//#endregion
