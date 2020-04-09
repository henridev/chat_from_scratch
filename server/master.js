const cluster = require("cluster");
const os = require("os");
const WebSocket = require("ws");

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

  //#region set up a single tcp server
  //   require("./tcpchatserver");
  /*
    this will be a server that is created once while the loads for the http will be 
    distributed accross the x created processes 
  */
  //#endregion

  const wss = new WebSocket.Server({ port: 1337 });
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
