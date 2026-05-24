export interface PlaceCandidate {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface RawPlace {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
}

const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";

export function getPlacesApiKey(): string | null {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.MAPS_API_KEY ||
    null
  );
}

export async function searchPlaces(
  textQuery: string,
  limit: number = 5,
): Promise<PlaceCandidate[]> {
  const key = getPlacesApiKey();
  if (!key) return [];
  const trimmed = textQuery.trim();
  if (trimmed.length < 2) return [];

  const res = await fetch(PLACES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location",
    },
    body: JSON.stringify({ textQuery: trimmed, maxResultCount: limit }),
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as { places?: RawPlace[] };
  const places = data.places ?? [];
  return places
    .map((p, idx): PlaceCandidate | null => {
      const lat = p.location?.latitude;
      const lng = p.location?.longitude;
      const name = p.displayName?.text;
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        !name
      ) {
        return null;
      }
      return {
        id: p.id ?? `${name}-${idx}`,
        name,
        address: p.formattedAddress ?? "",
        latitude: lat,
        longitude: lng,
      };
    })
    .filter((p): p is PlaceCandidate => p !== null);
}
