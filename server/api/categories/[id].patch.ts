import { updateCategory } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(event.context.params?.id);
  const body =
    await readBody<Partial<{ name: string; description: string }>>(event);
  const updated = updateCategory(id, body);
  return { data: updated };
});
