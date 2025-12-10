import { listProducts } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  // Extract pagination parameters
  const page = query.page ? Number(query.page) : 1;
  const itemsPerPage = query.itemsPerPage ? Number(query.itemsPerPage) : 10;
  const sortBy = query.sortBy ? String(query.sortBy) : undefined;
  const sortOrder = query.sortOrder ? String(query.sortOrder) : "asc";

  // Get all products matching filters
  const allProducts = listProducts({
    search: typeof query.search === "string" ? query.search : undefined,
    categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    labelId: query.labelId ? Number(query.labelId) : undefined,
  });

  // Sort products
  let sortedProducts = [...allProducts];
  if (sortBy) {
    sortedProducts.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  // Apply pagination
  const total = sortedProducts.length;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const data =
    itemsPerPage === -1 ? sortedProducts : sortedProducts.slice(start, end);

  return {
    data,
    total,
    page,
    itemsPerPage,
  };
});
