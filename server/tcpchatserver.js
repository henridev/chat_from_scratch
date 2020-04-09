const tcp = require("net"),
  config = require("./config");

const tcpserver = tcp.createServer();
const SOCKETS = {};

//#region TCP server handlers
const handleConnection = (socket) => {
  console.log("CLIENT CONNECTED TO SOCKET");

  socket.id = generateUniqueId();
  SOCKETS[socket.id] = socket;

  Object.entries(SOCKETS).forEach(([key, clientSocket]) => {
    if (key === socket.id) return;
    clientSocket.write(`NEW USER HAS JOINED CHAT ON ${createTimeStamp()} `);
    clientSocket.pipe(clientSocket);
  });
  //   socket.write("hello client");
  //   socket.pipe(socket);
  socket.on("data", handleSocketData.bind(this, socket)); // add an instance of this socket
};

const handleData = (data) => {
  console.log("tcp server data", data);
};

const handleServerClose = (data) => {
  console.log("someone disconnected from socket", data);
};
//#endregion TCP server hanlers

tcpserver.on("connection", handleConnection);
tcpserver.on("data", handleData);
tcpserver.on("close", handleServerClose);

tcpserver.listen(1337, config.host, null, () =>
  console.log(`tcp connection listening on port ${1337}`)
);

//#region utils
function createTimeStamp() {
  return new Date().toLocaleTimeString();
}

function generateUniqueId() {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}
//#endregion

//#region socket handlers
const handleSocketData = (socket, data) => {
  console.log(data.toString(), "socket data", socket.id);
};
//#endregion
