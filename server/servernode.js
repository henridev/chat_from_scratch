const http = require("http"),
  config = require("./config"),
  net = require("net"),
  { spawn } = require("child_process"),
  routeHandler = require("./routes/routehandler"),
  path = require("path"),
  fs = require("fs");

const server = http.createServer();

server.on("request", (req, res) => {
  const pathname = req.url;
  routeHandler(pathname, req, res);
});

//#region childprocess
// child process will allow us to execute commands in the OS
// it establishes connection with three pipes STDOUT / STDERR / STDIN
// this won't block the event loop
// const ls = spawn("ls");

// ls.stdout.on("data", (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on("close", (code) => {
//   console.log(`child process exited with code ${code}`);
// });
//#endregion

server.listen(config.port, config.host, () =>
  console.log(`listening to port ${config.port} \n process ID: ${process.pid}`)
);
