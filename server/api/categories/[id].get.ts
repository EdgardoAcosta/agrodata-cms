import { getCategory } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(event.context.params?.id);
  return {
    data: getCategory(id),
  };
});
