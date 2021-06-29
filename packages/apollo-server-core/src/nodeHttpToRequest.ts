import { IncomingMessage } from 'http';
import { Request, Headers } from 'apollo-server-env';

export function convertNodeHttpToRequest(req: IncomingMessage): Request {
  const headers = new Headers();
  Object.keys(req.headers).forEach(key => {
    const values = req.headers[key]!;
    if (Array.isArray(values) && !key.startsWith(':')) {
      values.forEach(value => headers.append(key, value));
    } else if(!key.startsWith(':')) {
      headers.append(key, values as any);
    }
  });

  return new Request(req.url!, {
    headers,
    method: req.method,
  });
}
