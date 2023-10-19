export default function getTotalPages(totalCount, limit) {
  const totalPages = Math.ceil(totalCount / limit);
  return totalPages;
}