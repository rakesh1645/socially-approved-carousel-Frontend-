import ApiRoutes from "./constant/apiroutes";
import APIController from "./controllers/APIController";

export function getVisitorId() {
  let id = localStorage.getItem("socially-approved-visitor");
  if (!id) {
    id =
      crypto.randomUUID?.() ||
      `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("socially-approved-visitor", id);
  }
  return id;
}

export async function fetchVideos({ signal } = {}) {
  const query = new URLSearchParams({
    limit: "40",
    visitorId: getVisitorId(),
  });
  return APIController.get({
    url: `${ApiRoutes.videos}?${query}`,
    signal,
  });
}

export async function toggleLike(videoId) {
  return APIController.post({
    url: ApiRoutes.like,
    values: { videoId, visitorId: getVisitorId() },
  });
}

export async function recordShare(videoId, platform) {
  return APIController.post({
    url: ApiRoutes.share,
    values: { videoId, platform, visitorId: getVisitorId() },
  });
}
