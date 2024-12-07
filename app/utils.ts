import * as fs from "fs/promises";

/**
 * Get the path from the request data
 * @param data
 * @returns path
 *
 * @example
 * getPath("GET / HTTP/1.1\r\nHost: localhost:8080\r\nConnection: keep-alive\r\n\r\n")
 * // => "/"
 */
export function getPath(data: string) {
  return data.split("\n")[0].split(" ")[1].trim();
}

/**
 * Get the user agent from the request data
 * @param data
 * @returns user agent
 *
 * @example
 * getUserAgent("GET / HTTP/1.1\r\nHost: localhost:8080\r\nUser-Agent: Mozilla/5.0\r\n\r\n")
 * // => "Mozilla/5.0"
 */
export function getUserAgent(data: string) {
  const userAgentData = data.split("\n").find((line) => line.startsWith("User-Agent") || line.startsWith("user-agent"));
  if (!userAgentData) {
    return "";
  }
  const [, userAgent] = userAgentData.split(":");
  return userAgent.trim();
}

/**
 * Get the encoding from the request data
 * @param data
 * @returns encoding
 *
 * @example
 * getEncoding("GET / HTTP/1.1\r\nHost: localhost:8080\r\nAccept-Encoding: gzip, deflate\r\n\r\n")
 * // => "gzip"
 */
export function getEncoding(data: string): string | undefined {
  console.log("dd", data.split("\n"));
  const encodingData = data
    .split("\n")
    .find((line) => line.startsWith("Accept-Encoding") || line.startsWith("accept-encoding"));
  if (!encodingData) {
    return undefined;
  }

  const encoding = encodingData.split(":")[1].trim();
  const encodingSchemes = ["gzip", "deflate", "exi", "identity", "pack200-gzip", "br", "compress", "zstd"];
  const firstFoundScheme = encoding.split(",").find((scheme) => encodingSchemes.includes(scheme.trim()));
  return firstFoundScheme;
}

/**
 * Get the response for a file
 * @param filePath
 * @returns response
 *
 * @example
 * getFileResponse("test.txt")
 * // => "HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: 4\r\n\r\ntest"
 *
 * getFileResponse("nonexistent.txt")
 * // => "HTTP/1.1 404 Not Found\r\n\r\n"
 */
export async function getFileResponse(filePath: string): Promise<string> {
  let response = "";
  try {
    const file = await fs.stat(filePath);

    if (!file.isFile()) {
      response = "HTTP/1.1 404 Not Found\r\n\r\n";
    }

    const content = await fs.readFile(filePath, "utf-8");
    const fileSize = file.size;
    response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileSize}\r\n\r\n${content}`;
  } catch (error) {
    console.log("Error Block:", error);
    response = "HTTP/1.1 404 Not Found\r\n\r\n";
  }
  return response;
}

/**
 * Get the method from the request data
 * @param data
 * @returns method
 *
 * @example
 * getMethod("POST / HTTP/1.1\r\nHost: localhost:8080\r\nConnection: keep-alive\r\n\r\n")
 * // => "POST"
 */
export function getMethod(data: string) {
  return data.split("\n")[0].split(" ")[0].trim();
}
