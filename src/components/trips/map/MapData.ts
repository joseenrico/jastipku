export interface CountryData {
  id: string;
  slug: string;
  name: string;
  destination: string;
  coordinates: { lat: number; lng: number };
  zoomCenter: { lat: number; lng: number };
  zoomLevel: number;
  cities: CityData[];
}

export interface CityData {
  name: string;
  slug: string;
  coordinates: { lat: number; lng: number };
  jastiper_count: number;
  image: string;
}

export interface ConnectionPath {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

export const COUNTRIES_DATA: CountryData[] = [
  {
    id: 'south-korea',
    slug: 'south-korea',
    name: 'South Korea',
    destination: 'Korea',
    coordinates: { lat: 35.9078, lng: 127.7669 },
    zoomCenter: { lat: 35.9078, lng: 127.7669 },
    zoomLevel: 6,
    cities: [
      { name: 'Seoul', slug: 'seoul', coordinates: { lat: 37.5665, lng: 126.978 }, jastiper_count: 3, image: '/images/south-korea/south-korea-1.jpg' },
      { name: 'Busan', slug: 'busan', coordinates: { lat: 35.1796, lng: 129.0756 }, jastiper_count: 2, image: '/images/south-korea/south-korea-2.jpg' },
      { name: 'Jeju', slug: 'jeju', coordinates: { lat: 33.4996, lng: 126.5312 }, jastiper_count: 1, image: '/images/south-korea/south-korea-4.jpg' },
    ],
  },
  {
    id: 'japan',
    slug: 'japan',
    name: 'Japan',
    destination: 'Japan',
    coordinates: { lat: 36.2048, lng: 138.2529 },
    zoomCenter: { lat: 36.2048, lng: 138.2529 },
    zoomLevel: 5,
    cities: [
      { name: 'Tokyo', slug: 'tokyo', coordinates: { lat: 35.6762, lng: 139.6503 }, jastiper_count: 5, image: '/images/japan/japan-1.jpg' },
      { name: 'Osaka', slug: 'osaka', coordinates: { lat: 34.6937, lng: 135.5023 }, jastiper_count: 3, image: '/images/japan/japan-2.jpg' },
      { name: 'Kyoto', slug: 'kyoto', coordinates: { lat: 35.0116, lng: 135.7681 }, jastiper_count: 2, image: '/images/japan/japan-3.jpg' },
    ],
  },
  {
    id: 'usa',
    slug: 'usa',
    name: 'United States',
    destination: 'USA',
    coordinates: { lat: 37.0902, lng: -95.7129 },
    zoomCenter: { lat: 39.8283, lng: -98.5795 },
    zoomLevel: 4,
    cities: [
      { name: 'New York', slug: 'new-york', coordinates: { lat: 40.7128, lng: -74.006 }, jastiper_count: 4, image: '/images/usa/usa-1.jpg' },
      { name: 'Los Angeles', slug: 'los-angeles', coordinates: { lat: 34.0522, lng: -118.2437 }, jastiper_count: 3, image: '/images/usa/usa-2.jpg' },
      { name: 'San Francisco', slug: 'san-francisco', coordinates: { lat: 37.7749, lng: -122.4194 }, jastiper_count: 2, image: '/images/usa/usa-3.jpg' },
    ],
  },
  {
    id: 'thailand',
    slug: 'thailand',
    name: 'Thailand',
    destination: 'Thailand',
    coordinates: { lat: 15.87, lng: 100.9925 },
    zoomCenter: { lat: 15.87, lng: 100.9925 },
    zoomLevel: 5,
    cities: [
      { name: 'Bangkok', slug: 'bangkok', coordinates: { lat: 13.7563, lng: 100.5018 }, jastiper_count: 4, image: '/images/thailand/thailand-1.jpg' },
      { name: 'Chiang Mai', slug: 'chiang-mai', coordinates: { lat: 18.7883, lng: 98.9853 }, jastiper_count: 2, image: '/images/thailand/thailand-2.jpg' },
      { name: 'Phuket', slug: 'phuket', coordinates: { lat: 7.8804, lng: 98.3923 }, jastiper_count: 1, image: '/images/thailand/thailand-3.jpg' },
    ],
  },
  {
    id: 'singapore',
    slug: 'singapore',
    name: 'Singapore',
    destination: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    zoomCenter: { lat: 1.3521, lng: 103.8198 },
    zoomLevel: 11,
    cities: [
      { name: 'Orchard', slug: 'orchard', coordinates: { lat: 1.3048, lng: 103.8321 }, jastiper_count: 3, image: '/images/singapore/singapore-1.jpg' },
      { name: 'Marina Bay', slug: 'marina-bay', coordinates: { lat: 1.2838, lng: 103.8591 }, jastiper_count: 2, image: '/images/singapore/singapore-2.jpg' },
      { name: 'Chinatown', slug: 'chinatown', coordinates: { lat: 1.2816, lng: 103.8536 }, jastiper_count: 1, image: '/images/singapore/singapore-3.jpg' },
    ],
  },
  {
    id: 'united-kingdom',
    slug: 'united-kingdom',
    name: 'United Kingdom',
    destination: 'UK',
    coordinates: { lat: 55.3781, lng: -3.436 },
    zoomCenter: { lat: 55.3781, lng: -3.436 },
    zoomLevel: 5,
    cities: [
      { name: 'London', slug: 'london', coordinates: { lat: 51.5074, lng: -0.1278 }, jastiper_count: 5, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
      { name: 'Manchester', slug: 'manchester', coordinates: { lat: 53.4808, lng: -2.2426 }, jastiper_count: 2, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800' },
      { name: 'Edinburgh', slug: 'edinburgh', coordinates: { lat: 55.9533, lng: -3.1883 }, jastiper_count: 1, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800' },
    ],
  },
  {
    id: 'australia',
    slug: 'australia',
    name: 'Australia',
    destination: 'Australia',
    coordinates: { lat: -25.2744, lng: 133.7751 },
    zoomCenter: { lat: -25.2744, lng: 133.7751 },
    zoomLevel: 4,
    cities: [
      { name: 'Sydney', slug: 'sydney', coordinates: { lat: -33.8688, lng: 151.2093 }, jastiper_count: 4, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800' },
      { name: 'Melbourne', slug: 'melbourne', coordinates: { lat: -37.8136, lng: 144.9631 }, jastiper_count: 3, image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800' },
      { name: 'Gold Coast', slug: 'gold-coast', coordinates: { lat: -28.0167, lng: 153.4 }, jastiper_count: 2, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
    ],
  },
  {
    id: 'france',
    slug: 'france',
    name: 'France',
    destination: 'France',
    coordinates: { lat: 46.2276, lng: 2.2137 },
    zoomCenter: { lat: 46.2276, lng: 2.2137 },
    zoomLevel: 5,
    cities: [
      { name: 'Paris', slug: 'paris', coordinates: { lat: 48.8566, lng: 2.3522 }, jastiper_count: 6, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
      { name: 'Nice', slug: 'nice', coordinates: { lat: 43.7102, lng: 7.262 }, jastiper_count: 2, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800' },
      { name: 'Lyon', slug: 'lyon', coordinates: { lat: 45.764, lng: 4.8357 }, jastiper_count: 1, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' },
    ],
  },
  {
    id: 'germany',
    slug: 'germany',
    name: 'Germany',
    destination: 'Germany',
    coordinates: { lat: 51.1657, lng: 10.4515 },
    zoomCenter: { lat: 51.1657, lng: 10.4515 },
    zoomLevel: 5,
    cities: [
      { name: 'Berlin', slug: 'berlin', coordinates: { lat: 52.52, lng: 13.405 }, jastiper_count: 3, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800' },
      { name: 'Munich', slug: 'munich', coordinates: { lat: 48.1351, lng: 11.582 }, jastiper_count: 3, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800' },
      { name: 'Frankfurt', slug: 'frankfurt', coordinates: { lat: 50.1109, lng: 8.6821 }, jastiper_count: 2, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800' },
    ],
  },
  {
    id: 'italy',
    slug: 'italy',
    name: 'Italy',
    destination: 'Italy',
    coordinates: { lat: 41.8719, lng: 12.5674 },
    zoomCenter: { lat: 41.8719, lng: 12.5674 },
    zoomLevel: 5,
    cities: [
      { name: 'Rome', slug: 'rome', coordinates: { lat: 41.9028, lng: 12.4964 }, jastiper_count: 4, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800' },
      { name: 'Milan', slug: 'milan', coordinates: { lat: 45.4642, lng: 9.19 }, jastiper_count: 5, image: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800' },
      { name: 'Florence', slug: 'florence', coordinates: { lat: 43.7696, lng: 11.2558 }, jastiper_count: 3, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800' },
    ],
  },
];

export const getCountryBySlug = (slug: string): CountryData | undefined => {
  return COUNTRIES_DATA.find((c) => c.slug === slug);
};

export const getCityBySlug = (countrySlug: string, citySlug: string): CityData | undefined => {
  const country = getCountryBySlug(countrySlug);
  return country?.cities.find((city) => city.slug === citySlug);
};

export const getCityConnections = (cities: CityData[]): ConnectionPath[] => {
  const paths: ConnectionPath[] = [];
  for (let i = 0; i < cities.length - 1; i++) {
    paths.push({
      from: cities[i].coordinates,
      to: cities[i + 1].coordinates,
    });
  }
  return paths;
};

export const ORIGIN_POINT = { lat: -6.2088, lng: 106.8456 };
export const WORLD_CENTER: [number, number] = [20, 0];
export const WORLD_ZOOM = 2;
