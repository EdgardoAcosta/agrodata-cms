import { proxyToExternalAPI } from "../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  return await proxyToExternalAPI(event, "/cms/labels", { method: "GET" });
});
