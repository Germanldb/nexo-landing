import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { City, State } from 'country-state-city';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'data', 'geo');
const venezuelaSource = join(__dirname, 'sources', 'venezuela.json');

const OTRA_CIUDAD = { value: 'otra', label: 'Otra localidad / zona de cobertura' };

const HISPANIC_COUNTRIES = [
  { value: 'venezuela', label: 'Venezuela', iso: 'VE', source: 'venezuela-json' },
  { value: 'colombia', label: 'Colombia', iso: 'CO' },
  { value: 'mexico', label: 'México', iso: 'MX' },
  { value: 'argentina', label: 'Argentina', iso: 'AR' },
  { value: 'espana', label: 'España', iso: 'ES' },
  { value: 'peru', label: 'Perú', iso: 'PE' },
  { value: 'chile', label: 'Chile', iso: 'CL' },
  { value: 'ecuador', label: 'Ecuador', iso: 'EC' },
  { value: 'bolivia', label: 'Bolivia', iso: 'BO' },
  { value: 'paraguay', label: 'Paraguay', iso: 'PY' },
  { value: 'uruguay', label: 'Uruguay', iso: 'UY' },
  { value: 'costa_rica', label: 'Costa Rica', iso: 'CR' },
  { value: 'panama', label: 'Panamá', iso: 'PA' },
  { value: 'guatemala', label: 'Guatemala', iso: 'GT' },
  { value: 'honduras', label: 'Honduras', iso: 'HN' },
  { value: 'el_salvador', label: 'El Salvador', iso: 'SV' },
  { value: 'nicaragua', label: 'Nicaragua', iso: 'NI' },
  { value: 'republica_dominicana', label: 'República Dominicana', iso: 'DO' },
  { value: 'puerto_rico', label: 'Puerto Rico', iso: 'PR' },
  { value: 'cuba', label: 'Cuba', iso: 'CU' },
  { value: 'guinea_ecuatorial', label: 'Guinea Ecuatorial', iso: 'GQ' },
];

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function uniqueByValue(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
}

function buildVenezuela() {
  const raw = JSON.parse(readFileSync(venezuelaSource, 'utf8'));

  return {
    value: 'venezuela',
    label: 'Venezuela',
    cityLevel: 'municipio',
    source: 'zokeber/venezuela-json (CC BY 4.0) + INE/Wikipedia',
    states: raw.map((item) => ({
      value: slugify(item.estado),
      label: item.estado,
      cities: uniqueByValue([
        ...item.municipios.map((municipio) => ({
          value: slugify(municipio.municipio),
          label: municipio.municipio,
        })),
        OTRA_CIUDAD,
      ]),
    })),
  };
}

function buildFromCountryStateCity(meta) {
  if (meta.value === 'puerto_rico') {
    const cities = City.getCitiesOfState('US', 'PR') ?? [];

    return {
      value: meta.value,
      label: meta.label,
      cityLevel: 'municipio',
      source: 'country-state-city (US-PR)',
      states: [
        {
          value: 'puerto_rico',
          label: 'Puerto Rico',
          cities: uniqueByValue([
            ...cities.map((city) => ({
              value: slugify(city.name),
              label: city.name,
            })),
            OTRA_CIUDAD,
          ]),
        },
      ],
    };
  }

  const states = State.getStatesOfCountry(meta.iso) ?? [];

  return {
    value: meta.value,
    label: meta.label,
    cityLevel: 'ciudad',
    source: 'country-state-city',
    states: states.map((state) => {
      const cities = City.getCitiesOfState(meta.iso, state.isoCode) ?? [];

      return {
        value: slugify(state.name),
        label: state.name,
        cities: uniqueByValue([
          ...cities.map((city) => ({
            value: slugify(city.name),
            label: city.name,
          })),
          OTRA_CIUDAD,
        ]),
      };
    }),
  };
}

mkdirSync(outDir, { recursive: true });

const index = [];

for (const meta of HISPANIC_COUNTRIES) {
  const geo =
    meta.source === 'venezuela-json' ? buildVenezuela() : buildFromCountryStateCity(meta);

  const filePath = join(outDir, `${meta.value}.json`);
  writeFileSync(filePath, JSON.stringify(geo));
  index.push({
    value: meta.value,
    label: meta.label,
    cityLevel: geo.cityLevel,
    states: geo.states.length,
    cities: geo.states.reduce((sum, state) => sum + state.cities.length - 1, 0),
    bytes: Buffer.byteLength(JSON.stringify(geo)),
  });
}

writeFileSync(
  join(root, 'src', 'data', 'geo-hispano.ts'),
  `export type GeoCity = { value: string; label: string };
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

export const geoCountries = ${JSON.stringify(
    index.map(({ value, label, cityLevel }) => ({ value, label, cityLevel })),
    null,
    2,
  )} as const;

export function findCountryMeta(value: string) {
  return geoCountries.find((country) => country.value === value);
}

const geoCache = new Map<string, GeoCountry>();

export async function loadCountryGeo(value: string): Promise<GeoCountry | null> {
  if (geoCache.has(value)) return geoCache.get(value) ?? null;

  const response = await fetch(\`/data/geo/\${value}.json\`);
  if (!response.ok) return null;

  const data = (await response.json()) as GeoCountry;
  geoCache.set(value, data);
  return data;
}
`,
);

console.log('Geo data generated:');
for (const row of index) {
  console.log(
    `- ${row.label}: ${row.states} estados, ${row.cities} localidades (${Math.round(row.bytes / 1024)} KB)`,
  );
}
