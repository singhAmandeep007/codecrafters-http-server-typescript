import { getPath, getUserAgent, getEncoding, getFileResponse, getMethod } from "./utils";
import * as fs from "fs/promises";

import { expect, test, describe, jest, spyOn } from "bun:test";

describe("utils tests", () => {
  describe("getPath tests", () => {
    test("getPath should return the correct path", () => {
      const data = "GET / HTTP/1.1\r\nHost: localhost:8080\r\nConnection: keep-alive\r\n\r\n";
      expect(getPath(data)).toBe("/");
    });
  });

  describe("getUserAgent tests", () => {
    test("getUserAgent should return the correct user agent", () => {
      const data = "GET / HTTP/1.1\r\nHost: localhost:8080\r\nUser-Agent: Mozilla/5.0\r\n\r\n";
      expect(getUserAgent(data)).toBe("Mozilla/5.0");
    });

    test("getUserAgent should return an empty string if User-Agent is not present", () => {
      const data = "GET / HTTP/1.1\r\nHost: localhost:8080\r\n\r\n";
      expect(getUserAgent(data)).toBe("");
    });
  });

  describe("getEncoding tests", () => {
    test("getEncoding should return the correct encoding", () => {
      const data = "GET / HTTP/1.1\r\nHost: localhost:8080\r\nAccept-Encoding: gzip, deflate\r\n\r\n";
      expect(getEncoding(data)).toBe("gzip");
    });

    test("getEncoding should return undefined if Accept-Encoding is not present", () => {
      const data = "GET / HTTP/1.1\r\nHost: localhost:8080\r\n\r\n";
      expect(getEncoding(data)).toBeUndefined();
    });
  });

  describe("getFileResponse tests", () => {
    test("getFileResponse should return 200 OK with file content", async () => {
      const filePath = "test.txt";
      spyOn(fs, "stat").mockResolvedValueOnce({ isFile: () => true, size: 4 } as any);
      spyOn(fs, "readFile").mockResolvedValueOnce("test");

      const response = await getFileResponse(filePath);
      expect(response).toBe(
        "HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: 4\r\n\r\ntest"
      );
    });

    test("getFileResponse should return 404 Not Found if file does not exist", async () => {
      const filePath = "nonexistent.txt";
      spyOn(fs, "stat").mockRejectedValueOnce(new Error("File not found"));

      const response = await getFileResponse(filePath);
      expect(response).toBe("HTTP/1.1 404 Not Found\r\n\r\n");
    });
  });

  describe("getMethod tests", () => {
    test("getMethod should return the correct method", () => {
      const data = "POST / HTTP/1.1\r\nHost: localhost:8080\r\nConnection: keep-alive\r\n\r\n";
      expect(getMethod(data)).toBe("POST");
    });
  });
});
