import { createProduct } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

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

  const product = createProduct(body);
  return { data: product };
});
