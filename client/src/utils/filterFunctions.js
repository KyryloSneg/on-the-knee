export function nextAddedFilters(filters, filterKey, value) {
  const nextFilters = {
    ...filters,
    [filterKey]: filters[filterKey] ? [...filters[filterKey], value] : [value]
  }

  return nextFilters;
}

export function nextRemovedFilters(filters, filterKey, value) {
  let nextFilters;

  if (filters[filterKey].length !== 1) {
    nextFilters = {
      ...filters,
      [filterKey]: filters[filterKey].filter(f => f !== value)
    }
  } else {
    const filtersClone = {...filters};
    delete filtersClone[filterKey];
    nextFilters = filtersClone;
  }
 
  return nextFilters;
}