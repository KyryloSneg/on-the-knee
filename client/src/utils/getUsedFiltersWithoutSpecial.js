import { SPECIAL_TO_HANDLE_FILTERS } from "./consts";

export default function getUsedFiltersWithoutSpecial(usedFilters) {
  let filtersWithoutSpecial = {};
  for (let [key, value] of Object.entries({ ...usedFilters })) {
    if (SPECIAL_TO_HANDLE_FILTERS.includes(key)) continue;
    filtersWithoutSpecial[key] = value;
  }

  return filtersWithoutSpecial;
}