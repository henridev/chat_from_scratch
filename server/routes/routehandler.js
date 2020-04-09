//#region imports
const config = require("../config.json"),
  fs = require("fs"),
  path = require("path"),
  net = require("net"),
  mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };
//#endregion

function routeHandler(pathname, req, res) {
  if (req.url.includes("assets")) {
    handleFileServing(pathname, req, res);
    return;
  }

  if (Object.values(config.routes).includes(pathname)) {
    res.writeHead(200, { "content-type": "text/html" });
  }

  if (pathname === config.routes.homepage) {
    res.end(fs.readFileSync(generateHTMLpathToRead(pathname)));
  }

  if (pathname === config.routes.chatgroup) {
    res.end(fs.readFileSync(generateHTMLpathToRead(pathname)));
  }

  if (pathname === "/") {
    // if path is unspecified redirect to the homepage
    console.log("pathname redirection", pathname);
    res.writeHead(302, { Location: "/home" });
    res.end();
  }

  // in case a none defined route is passed show the error page
  res.writeHead(404, { "content-type": "text/html" });
  const rs = fs.createReadStream(generateHTMLpathToRead("/error"));
  rs.pipe(res); // pipe auto calls res.end()
}

//#region UTILS
const generateHTMLpathToRead = (pathname) =>
  path.join(__dirname, "..", "..", "client", "dist", `${pathname}.html`);
const generateAssetPathToRead = (pathname) =>
  path.join(__dirname, "..", "..", "client", "dist", `${pathname}`);

const handleFileServing = (pathname, req, res) => {
  let filePath = generateAssetPathToRead("." + req.url);
  const extname = String(path.extname(filePath)).toLowerCase();

  const filestream = fs.createReadStream(filePath);

  filestream.on("error", (err) => console.error("read stream error", err));

  const contentType = mimeTypes[extname] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });

  filestream.pipe(res);
};

//#endregion end UTILS

//#region TCP create client to connect
//  const handleDataReceptionTCPServer = (data) => {
//     console.log("received data from tcp server on HTTP server");
//     console.log("data", data.toString());
//   };

//   const handleClientConnectionError = (err) => {
//     console.error(err);
//   };

// const client = new net.Socket();
// client.connect(1337, "127.0.0.1", () => {
//   console.log("server connecting to client");
//   client.write("hello server this is client speaking ");
// });

// client.on("data", handleDataReceptionTCPServer);
// client.on("error", handleClientConnectionError);
//#endregion TCP client close

module.exports = routeHandler;
