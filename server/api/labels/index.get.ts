import { listLabels } from "../../utils/cmsRepo";
import { requireUserSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  // Extract pagination parameters
  const page = query.page ? Number(query.page) : 1;
  const itemsPerPage = query.itemsPerPage ? Number(query.itemsPerPage) : 10;
  const sortBy = query.sortBy ? String(query.sortBy) : undefined;
  const sortOrder = query.sortOrder ? String(query.sortOrder) : "asc";
  const search = typeof query.search === "string" ? query.search : undefined;

  // Get all labels
  let allLabels = listLabels();

  // Filter by search
  if (search) {
    const term = search.toLowerCase();
    allLabels = allLabels.filter(
      (label: any) =>
        label.id.toString().includes(term) ||
        label.name.toLowerCase().includes(term) ||
        label.description?.toLowerCase().includes(term)
    );
  }

  // Sort labels
  let sortedLabels = [...allLabels];
  if (sortBy) {
    sortedLabels.sort((a: any, b: any) => {
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
  const total = sortedLabels.length;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const data =
    itemsPerPage === -1 ? sortedLabels : sortedLabels.slice(start, end);

  return {
    data,
    total,
    page,
    itemsPerPage,
  };
});
