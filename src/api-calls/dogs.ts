const base = process.env.REACT_APP_API_URL;

export const getDogBreeds = async (): Promise<Array<string>> => {
  const response = await fetch(`${base}/dogs/breeds`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load breeds. ${response.status}`);
  }

  return response.json();
};

export type TDog = {
  img: string;
  name: string;
  age: number;
  breed: string;
  zipCode: string;
  id: string;
};

export const fetchDogs = async (ids: Array<string>): Promise<TDog[]> => {
  const url = `${base}/dogs`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(ids),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dogs: ${response.status}`);
  }

  const data: {
    img: string;
    name: string;
    age: number;
    breed: string;
    /* eslint-disable camelcase */
    zip_code: string;
    id: string;
  }[] = await response.json();

  return data.map(({ zip_code, ...rest }) => ({
    ...rest,
    zipCode: zip_code,
    /* eslint-enable camelcase */
  }));
};

export const searchDogs = async (
  searchParams?: {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    sort: string;
  },
  urlOverride?: string,
) => {
  const url =
    urlOverride ||
    (() => {
      const params = new URLSearchParams();

      if (searchParams?.breeds?.length) {
        searchParams.breeds.forEach((breed) => params.append("breeds", breed));
      }
      if (searchParams?.zipCodes?.length) {
        searchParams.zipCodes.forEach((zip) => params.append("zipCodes", zip));
      }
      if (searchParams?.ageMin !== undefined) {
        params.append("ageMin", searchParams.ageMin.toString());
      }
      if (searchParams?.ageMax !== undefined) {
        params.append("ageMax", searchParams.ageMax.toString());
      }
      params.append("size", (searchParams?.size || 25).toString());
      params.append("sort", `breed:${searchParams?.sort}`);

      return `${base}/dogs/search?${params}`;
    })();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dogs: ${response.status}`);
  }

  const data = await response.json();

  if (data.total > 0) {
    const dogs = await fetchDogs(data.resultIds);
    return {
      dogs,
      total: data.total,
      next: data.next, // Pagination next URL
      prev: data.prev, // Pagination prev URL
    };
  }

  throw new Error("No dogs found, please search again");
};

export const matchDogFromIds = async (dogIds: string[]) => {
  const response = await fetch(`${base}/dogs/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dogIds),
  });

  if (!response.ok) {
    throw new Error(`Failed to find a match: ${response.status}`);
  }

  return response.json();
};

export const searchLocationsByCity = async (
  city: string,
): Promise<string[]> => {
  const response = await fetch(`${base}/locations/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ city, size: 25 }), // ✅ Only sending city and limiting results
  });

  if (!response.ok) {
    throw new Error(`Failed to search locations: ${response.status}`);
  }

  const data = await response.json();
  if (data.total > 0) {
    return data.results.map((location: any) => location.zip_code); // ✅ Extract zip codes
  }

  throw new Error("No locations found, please search again");
};
