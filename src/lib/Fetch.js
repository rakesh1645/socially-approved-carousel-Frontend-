export default class Fetch {
  static async request({ method, url, body, headers = {}, signal }) {
    const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const error = new Error(data?.error || data?.message || "Request failed");
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  }
}
