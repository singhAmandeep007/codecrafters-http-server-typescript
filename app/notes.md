
# HTTP Response

An HTTP response is made up of three parts, each separated by a CRLF (\r\n):

1. **Status line**
2. **Zero or more headers**, each ending with a CRLF
3. **Optional response body**

In this stage, your server's response will only contain a status line. Here's the response your server must send:

## Example response:
```
HTTP/1.1 200 OK\r\n\r\n
```

Here's a breakdown of the response:

- **Status line**
	- `HTTP/1.1`  // HTTP version
	- `200`       // Status code
	- `OK`        // Optional reason phrase
	- `\r\n`      // CRLF that marks the end of the status line

- **Headers** (empty)
	- `\r\n`      // CRLF that marks the end of the headers

- **Response body** (empty)

[Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_responses)