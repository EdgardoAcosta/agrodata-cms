import { proxyToExternalAPI } from "../../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await proxyToExternalAPI(event, "/warehouse/inventory", {
    method: "POST",
    body,
  });
});
