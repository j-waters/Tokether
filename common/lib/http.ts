interface HttpResponse<T> extends Response {
  parsedBody?: T;
}
export async function http<T>(
  request: RequestInfo,
  options?: RequestInit
): Promise<Response> {
  return await fetch(request, options);
}

export async function httpJSON<T>(
  request: RequestInfo,
  options?: RequestInit
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request, options);
  response.parsedBody = await response
    .clone()
    .json()
    .catch((err) => console.log("err", err));
  return response;
}
