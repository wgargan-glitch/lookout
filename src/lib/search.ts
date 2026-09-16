export type CarsSearch = {
  park?: string;
  from?: string;
  to?: string;
  category?: string;
  q?: string;
  camping?: boolean;
  pet?: boolean;
  electric?: boolean;
  instant?: boolean;
  sort?: string;
};

export function validateCarsSearch(search: Record<string, unknown>): CarsSearch {
  const str = (key: string) =>
    typeof search[key] === "string" && search[key] ? (search[key] as string) : undefined;
  const flag = (key: string) => search[key] === true || search[key] === "1" || search[key] === "true";
  return {
    park: str("park"),
    from: str("from"),
    to: str("to"),
    category: str("category"),
    q: str("q"),
    camping: flag("camping") || undefined,
    pet: flag("pet") || undefined,
    electric: flag("electric") || undefined,
    instant: flag("instant") || undefined,
    sort: str("sort"),
  };
}
