import { proxyToExternalAPI } from "../../utils/apiProxy";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  return await proxyToExternalAPI(event, `/cms/categories/${id}`, {
    method: "DELETE",
  });
});
