import net, { Server } from "net";
import * as fs from "fs/promises";
import path from "path";
import zlib from "zlib";

import { getPath, getEncoding, getUserAgent, getMethod, getFileResponse } from "./utils";

export function createServer(): Server {
  const server = net.createServer((socket) => {
    socket.on("connect", () => {
      console.log("Client connected");
    });
    // Close the connection when the client closes the connection
    socket.on("close", () => {
      socket.end();
    });
    // Handle the data received from the client
    socket.on("data", async (data) => {
      console.log("Data received", data.toString());
      const requestPath = getPath(data.toString());
      let response = "";
      let zipped = null;
      const encoding = getEncoding(data.toString());
      // Handle the request based on the path
      // If the path is "/", respond with HTTP 200 OK
      if (requestPath === "/") {
        response = `HTTP/1.1 200 OK${encoding ? `\r\nContent-Encoding: ${encoding}` : ""}\r\n\r\n`;
      } else if (requestPath.startsWith("/echo")) {
        // If the path is "/echo", respond with the request data
        // example: GET /echo/hello HTTP/1.1
        const param = requestPath.slice(6);

        if (encoding && encoding === "gzip") {
          const buffer = Buffer.from(param, "utf8");
          zipped = zlib.gzipSync(new Uint8Array(buffer));
          response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain${
            encoding ? `\r\nContent-Encoding: ${encoding}` : ""
          }\r\nContent-Length: ${zipped.length}\r\n\r\n`;
        } else {
          response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain${
            encoding ? `\r\nContent-Encoding: ${encoding}` : ""
          }\r\nContent-Length: ${param.length}\r\n\r\n${param}`;
        }
      } else if (requestPath.startsWith("/user-agent")) {
        const userAgent = getUserAgent(data.toString());

        response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain${
          encoding ? `\r\nContent-Encoding: ${encoding}` : ""
        }\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      } else if (requestPath.startsWith("/files")) {
        const requestMethod = getMethod(data.toString());

        // Get the directory from the command line arguments
        const directory = process.argv[3];
        const fileName = requestPath.split("/")[2];
        const filePath = `${directory}/${fileName}`;

        if (requestMethod === "GET") {
          response = await getFileResponse(filePath);
        } else if (requestMethod === "POST") {
          // Get the request body and write it to the file
          const requestBody = data.toString().split("\r\n\r\n")[1].trim();
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          // Write the file to the directory
          await fs.writeFile(filePath, requestBody);
          response = "HTTP/1.1 201 Created\r\n\r\n";
        } else {
          response = "HTTP/1.1 405 Method Not Allowed\r\n\r\n";
        }
      } else {
        response = "HTTP/1.1 404 Not Found\r\n\r\n";
      }
      // Send the response to the client
      socket.write(response, () => {
        console.log("Response sent", response);
      });
      // Send the zipped data to the client if it exists
      zipped &&
        socket.write(new Uint8Array(zipped), () => {
          console.log("Zipped data sent", zipped);
        });
      socket.pipe(socket);
    });
  });

  return server;
}
