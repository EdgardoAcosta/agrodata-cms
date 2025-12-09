import { listCategories } from "../../utils/cmsRepo";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  // Extract pagination parameters
  const page = query.page ? Number(query.page) : 1;
  const itemsPerPage = query.itemsPerPage ? Number(query.itemsPerPage) : 10;
  const sortBy = query.sortBy ? String(query.sortBy) : undefined;
  const sortOrder = query.sortOrder ? String(query.sortOrder) : "asc";
  const search = typeof query.search === "string" ? query.search : undefined;

  // Get all categories
  let allCategories = listCategories();

  // Filter by search
  if (search) {
    const term = search.toLowerCase();
    allCategories = allCategories.filter(
      (cat: any) =>
        cat.name.toLowerCase().includes(term) ||
        cat.description?.toLowerCase().includes(term)
    );
  }

  // Sort categories
  let sortedCategories = [...allCategories];
  if (sortBy) {
    sortedCategories.sort((a: any, b: any) => {
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
  const total = sortedCategories.length;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const data =
    itemsPerPage === -1 ? sortedCategories : sortedCategories.slice(start, end);

  return {
    data,
    total,
    page,
    itemsPerPage,
  };
});
