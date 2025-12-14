import { proxyToExternalAPI } from "../../../../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  return await proxyToExternalAPI(
    event,
    `/warehouse/inventory/cycle-count/sessions/${id}`,
    {
      method: "PUT",
      body,
    }
  );
});
