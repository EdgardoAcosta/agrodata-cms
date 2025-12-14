import { proxyToExternalAPI } from "../../../../../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  const sessionId = event.context.params?.sessionId;
  return await proxyToExternalAPI(
    event,
    `/warehouse/inventory/cycle-count/sessions/${sessionId}/items`,
    {
      method: "GET",
    }
  );
});
