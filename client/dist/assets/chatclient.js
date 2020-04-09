let connection;
let currentMessage = "";
let inputfield;
let sendButton;
let chatbox;
const username = document.getElementById("username");
const joinbutton = document.getElementById("joinbutton");

joinbutton.addEventListener("click", (e) => {
  const chosenName = username.value || "unknown";
  connection = new WebSocket("ws://127.0.0.1:1337");
  connection.onopen = function () {
    destroyjoinElements();
    createChatElements();
    connection.send(
      JSON.stringify({
        firstConnection: true,
        username: chosenName,
      })
    );
    inputfield.disabled = false;
  };

  connection.onerror = function (error) {
    // an error occurred when sending/receiving data
  };

  connection.onmessage = function (info) {
    const { username, message } = JSON.parse(info.data);
    if (message === "new join") {
      chatbox.innerText += `\n new user joined ${username} 👋👋👋`;
      return;
    }
    chatbox.innerText += `\n ${username} says ${message}`;
  };
});

function destroyjoinElements() {
  username.parentNode.removeChild(username);
  joinbutton.parentNode.removeChild(joinbutton);
}

function createChatElements() {
  sendButton = document.createElement("button");
  sendButton.innerText = "send message";
  sendButton.addEventListener("click", (e) =>
    connection.send(
      JSON.stringify({
        message: currentMessage,
      })
    )
  );

  inputfield = document.createElement("input");
  inputfield.addEventListener(
    "keyup",
    (e) => (currentMessage = e.target.value)
  );

  chatbox = document.createElement("div");

  document.body.appendChild(chatbox);
  document.body.appendChild(inputfield);
  document.body.appendChild(sendButton);
}
