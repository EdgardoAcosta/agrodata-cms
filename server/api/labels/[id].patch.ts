import { updateLabel } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(event.context.params?.id);
  const body =
    await readBody<Partial<{ name: string; description: string }>>(event);
  const updated = updateLabel(id, body);
  return { data: updated };
});
