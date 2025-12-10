import { createCategory } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const body =
    await readBody<Partial<{ name: string; description: string }>>(event);
  const category = createCategory(body);

  return {
    data: category,
  };
});
