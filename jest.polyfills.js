const { TextEncoder, TextDecoder } = require('node:util');
const { ReadableStream } = require('node:stream/web');
const { Request, Response, Headers, FormData, fetch } = require('undici');

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
  ReadableStream: { value: ReadableStream },
  Request: { value: Request },
  Response: { value: Response },
  Headers: { value: Headers },
  FormData: { value: FormData },
  fetch: { value: fetch }
}); 