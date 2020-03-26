// these are the dependencies, 'http' is used to create the server, 'fs' is used to write to a file
let http = require("http");
const fs = require("fs");

// this specifies the port the server should run in
let port = 8084;

// creating server
http
  .createServer(function(req, res) {
    // this is an http header that tells the browser to treat responses as an html text
    res.writeHead(200, { "Content-Type": "text/html" });

    // we use this to grap the url depending on the request coming
    var url = req.url;

    // if the url is '/' we route to the default
    if (url === "/") {
      // we write our html form here with the input and button , NOTE: we specified the name of the input as message
      res.write(
        "<form method='POST' action='/messages'> <input name='message' type='text' placeholder='type your message' > <button type='submit'>SUBMIT</button></form>"
      );
      res.end();
    } else if (url === "/messages" && req.method === "POST") {
      // here we handle post requests that the url is '/messges'

      let body = "";

      // request body is buffer by default, so we have to convert it to string
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        console.log(body);
        // after conversion we get 'message=WhateverTextWasInputted', why meesage? because we named the input field as 'message'

        // so in order to get the actual value, we replace 'message=' with an empty string
        let message = body.replace("message=", "");

        var stream = fs.createWriteStream("message.txt", { flags: "a" });
        // write to a new file named message.txt
        stream.write(message + "\n");

        res.end("Message saved!");
      });
    } else {
      // This handles default message for routes that were not specified
      res.write("<h1>PAGE NOT FOUND<h1>");
      res.end();
    }
  })
  .listen(port, function() {
    console.log(`server running on port ${port}`);
  });
