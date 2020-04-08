const cluster = require("cluster");
const os = require("os");

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
