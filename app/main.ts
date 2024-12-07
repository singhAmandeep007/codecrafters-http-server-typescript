import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("Received request:", data.toString());

    /**
		 * HTTP response - An HTTP response is made up of three parts, each separated by a CRLF (\r\n):
		 * Status line.
		 * Zero or more headers, each ending with a CRLF.
		 * Optional response body.
		 * In this stage, your server's response will only contain a status line. Here's the response your server must send:
		 * Example response:
				HTTP/1.1 200 OK\r\n\r\n
				// Here's a breakdown of the response:
				// Status line
				HTTP/1.1  // HTTP version
				200       // Status code
				OK        // Optional reason phrase
				\r\n      // CRLF that marks the end of the status line

				// Headers (empty)
				\r\n      // CRLF that marks the end of the headers

				// Response body (empty)
			
			* READ-MORE: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_responses
		 */
    const response = `HTTP/1.1 200 OK\r\n\r\n`;

    // Send the response and close the connection.
    socket.write(response);
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });
});

// a TCP server that listens on port 4221.
server.listen(4221, "localhost");
