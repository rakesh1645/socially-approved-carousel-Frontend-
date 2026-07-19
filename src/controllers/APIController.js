import Fetch from "../lib/Fetch";

export default class APIController {
  static API_KEY = import.meta.env.VITE_API_KEY || "";

  static headers(token, hasBody = false) {
    const headers = { Accept: "application/json" };
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    if (APIController.API_KEY) headers["x-api-key"] = APIController.API_KEY;
    return headers;
  }

  static async request({ method, url, values, token, signal }) {
    try {
      return await Fetch.request({
        method,
        url,
        body: values,
        headers: APIController.headers(token, values !== undefined),
        signal,
      });
    } catch (error) {
      throw {
        status: error?.status,
        data: error?.details?.error || error?.details || error?.message,
      };
    }
  }

  static get({ url, token, signal }) {
    return APIController.request({ method: "GET", url, token, signal });
  }

  static post({ url, values, token, signal }) {
    return APIController.request({ method: "POST", url, values, token, signal });
  }

  static patch({ url, values, token, signal }) {
    return APIController.request({ method: "PATCH", url, values, token, signal });
  }

  static delete({ url, token, signal }) {
    return APIController.request({ method: "DELETE", url, token, signal });
  }
}
