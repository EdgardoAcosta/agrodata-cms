import { proxyToExternalAPI } from "../../../../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  return await proxyToExternalAPI(
    event,
    "/warehouse/inventory/cycle-count/sessions",
    {
      method: "GET",
    }
  );
});
