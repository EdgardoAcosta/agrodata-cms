import { updateProduct } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(event.context.params?.id);
  const body = await readBody<
    Partial<{
      name: string;
      slug: string;
      description: string;
      shortDescription: string;
      price: number;
      currency: string;
      inStock: boolean;
      featured: boolean;
      image: string;
      categoryIds: number[];
      labelIds: number[];
    }>
  >(event);

  const updated = updateProduct(id, body);
  return { data: updated };
});
