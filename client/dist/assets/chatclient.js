const connection = new WebSocket("ws://127.0.0.1:1337");

connection.onopen = function () {
  // connection is opened and ready to use

  connection.send("here is some text for the server");
};

connection.onerror = function (error) {
  // an error occurred when sending/receiving data
};

connection.onmessage = function (message) {
  // try to decode json (I assume that each message
  // from server is json)
  console.log("message", message);
  try {
    var json = JSON.parse(message.data);
  } catch (e) {
    console.log("This doesn't look like a valid JSON: ", message.data);
    return;
  }
  // handle incoming message
};
