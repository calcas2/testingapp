var http = require("http");
var fs = require("fs");
var mime = require("mime");
var path = require("path");
var cache = {};
var chatserver = require("./lib/chat_server");

var server = http.createServer(function(request, response) {
var filepath = false;

if (request.url == "/") {
filepath = "public/index.html";
} else {
filepath = "public" + request.url;
}
var absPath = "./" + filepath;
serveStatic(response, cache, absPath);
});

function serveStatic(response, cache, absPath) {
if (cache[absPath]) {
sendFile(response, absPath, cache[absPath]);
} else {
fs.exists(absPath, function(exists) {
if (exists) {
fs.readFile(absPath, function(err, data) {
if (err) {
send404(response);
} else {
cache[absPath] = data;
sendFile(response, absPath, data);
}
});
} else {
console.log("resources not found: " + absPath );
send404(response);
}
});
}
}

function sendFile(response, filePath, fileContent) {
response.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
response.end(fileContent);
}

function send404(response) {
response.writeHead(404, {"Content-Type": "text/plain"});
response.write("Error 404: resource not found");
response.end();
}

chatserver.listen(server);
server.listen(3000);

