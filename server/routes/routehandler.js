const config = require("../config.json"),
  fs = require("fs"),
  path = require("path");

function routeHandler(pathname, req, res) {
  if (Object.values(config.routes).includes(pathname)) {
    res.writeHead(200, { "content-type": "text/html" });
  }

  if (pathname === config.routes.homepage) {
    res.end(fs.readFileSync(generatePathToRead(pathname)));
  }

  if (pathname === config.routes.chatgroup) {
    res.end(fs.readFileSync(generatePathToRead(pathname)));
  }

  if (pathname === "/") {
    // if path is unspecified redirect to the homepage
    console.log("pathname redirection", pathname);
    res.writeHead(302, { Location: "/home" });
    res.end();
  }

  // in case a none defined route is passed show the error page
  res.writeHead(404, { "content-type": "text/html" });
  const rs = fs.createReadStream(generatePathToRead("/error"));
  rs.pipe(res); // pipe auto calls res.end()
}

const generatePathToRead = (pathname) =>
  path.join(__dirname, "..", "..", "client", "dist", `${pathname}.html`);

module.exports = routeHandler;
