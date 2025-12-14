import { proxyToExternalAPI } from "../../../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  const code = event.context.params?.code;
  return await proxyToExternalAPI(
    event,
    `/warehouse/inventory/barcode/${code}`,
    {
      method: "GET",
    }
  );
});
