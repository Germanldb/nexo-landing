export type GeoCity = { value: string; label: string };
export type GeoState = { value: string; label: string; cities: GeoCity[] };
export type GeoCountry = {
  value: string;
  label: string;
  cityLevel?: 'municipio' | 'ciudad';
  source?: string;
  states: GeoState[];
};

export const DEFAULT_COUNTRY = 'venezuela';
export const OTRA_CIUDAD_VALUE = 'otra';

export const geoCountries = [
  {
    "value": "venezuela",
    "label": "Venezuela",
    "cityLevel": "municipio"
  },
  {
    "value": "colombia",
    "label": "Colombia",
    "cityLevel": "ciudad"
  },
  {
    "value": "mexico",
    "label": "México",
    "cityLevel": "ciudad"
  },
  {
    "value": "argentina",
    "label": "Argentina",
    "cityLevel": "ciudad"
  },
  {
    "value": "espana",
    "label": "España",
    "cityLevel": "ciudad"
  },
  {
    "value": "peru",
    "label": "Perú",
    "cityLevel": "ciudad"
  },
  {
    "value": "chile",
    "label": "Chile",
    "cityLevel": "ciudad"
  },
  {
    "value": "ecuador",
    "label": "Ecuador",
    "cityLevel": "ciudad"
  },
  {
    "value": "bolivia",
    "label": "Bolivia",
    "cityLevel": "ciudad"
  },
  {
    "value": "paraguay",
    "label": "Paraguay",
    "cityLevel": "ciudad"
  },
  {
    "value": "uruguay",
    "label": "Uruguay",
    "cityLevel": "ciudad"
  },
  {
    "value": "costa_rica",
    "label": "Costa Rica",
    "cityLevel": "ciudad"
  },
  {
    "value": "panama",
    "label": "Panamá",
    "cityLevel": "ciudad"
  },
  {
    "value": "guatemala",
    "label": "Guatemala",
    "cityLevel": "ciudad"
  },
  {
    "value": "honduras",
    "label": "Honduras",
    "cityLevel": "ciudad"
  },
  {
    "value": "el_salvador",
    "label": "El Salvador",
    "cityLevel": "ciudad"
  },
  {
    "value": "nicaragua",
    "label": "Nicaragua",
    "cityLevel": "ciudad"
  },
  {
    "value": "republica_dominicana",
    "label": "República Dominicana",
    "cityLevel": "ciudad"
  },
  {
    "value": "puerto_rico",
    "label": "Puerto Rico",
    "cityLevel": "municipio"
  },
  {
    "value": "cuba",
    "label": "Cuba",
    "cityLevel": "ciudad"
  },
  {
    "value": "guinea_ecuatorial",
    "label": "Guinea Ecuatorial",
    "cityLevel": "ciudad"
  }
] as const;

export function findCountryMeta(value: string) {
  return geoCountries.find((country) => country.value === value);
}

const geoCache = new Map<string, GeoCountry>();

export async function loadCountryGeo(value: string): Promise<GeoCountry | null> {
  if (geoCache.has(value)) return geoCache.get(value) ?? null;

  const response = await fetch(`/data/geo/${value}.json`);
  if (!response.ok) return null;

  const data = (await response.json()) as GeoCountry;
  geoCache.set(value, data);
  return data;
}
