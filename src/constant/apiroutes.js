export default class ApiRoutes {
  static baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

  static videos = `${ApiRoutes.baseUrl}/videos`;
  static like = `${ApiRoutes.baseUrl}/like`;
  static share = `${ApiRoutes.baseUrl}/share`;
}
