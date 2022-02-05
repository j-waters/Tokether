interface HttpResponse<T> extends Response {
  parsedBody?: T;
}
export async function http<T>(request: RequestInfo): Promise<Response> {
  return await fetch(request);
}

export async function httpJSON<T>(
  request: RequestInfo
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);
  response.parsedBody = await response
    .clone()
    .json()
    .catch((err) => console.log("err", err));
  return response;
}
