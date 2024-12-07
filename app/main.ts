import { createServer } from "./server";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = createServer();

// a TCP server that listens on port 4221.
server.listen(4221, "localhost");
