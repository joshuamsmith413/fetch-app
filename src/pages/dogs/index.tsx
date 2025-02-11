import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";

import {
  getDogBreeds,
  searchDogs,
  searchLocationsByCity,
} from "api-calls/dogs";
import LoadingErrorHandler from "components/LoadingErrorHandler";
import DogCard from "pages/dogs/DogCard";
import DogPagination from "pages/dogs/DogPagination";

export default function Dogs() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [city, setCity] = useState<string>("");
  const [ageMin, setAgeMin] = useState<number>(0);
  const [ageMax, setAgeMax] = useState<number>(25);
  const [sort, setSort] = useState("asc");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const {
    data: breedData,
    isLoading: breedLoading,
    error: breedError,
    isError: isBreedError,
  } = useQuery({
    queryKey: ["breeds"],
    queryFn: getDogBreeds,
  });

  const {
    mutate: fetchDogs,
    data: dogData,
    isPending: dogsLoading,
    error: dogError,
    isError: isDogError,
  } = useMutation({
    mutationFn: ({
      searchParams,
      urlOverride,
    }: {
      searchParams?: {
        breeds?: string[];
        zipCodes?: string[];
        ageMin?: number;
        ageMax?: number;
        size?: number;
        sort: string;
      };
      urlOverride?: string;
    }) => searchDogs(searchParams, urlOverride),
  });

  const {
    mutate: searchCity,
    isPending: isCityLoading,
    error: cityError,
    isError: isCityError,
  } = useMutation({
    mutationFn: searchLocationsByCity,
    onSuccess: (data) => setZipCodes(data), // Store results
  });

  const handleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.some((fav) => fav === dogId)
        ? prev.filter((fav) => fav !== dogId)
        : [...prev, dogId];

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      searchCity(city);
    } else {
      fetchDogs({
        searchParams: { breeds, zipCodes, ageMin, ageMax, sort },
      });
    }
  };

  useEffect(() => {
    if (zipCodes.length > 0) {
      fetchDogs({
        searchParams: { breeds, zipCodes, ageMin, ageMax, sort },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCodes]);

  const handleBreedChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
  ) => {
    setBreeds(selectedOptions.map((option) => option.value));
  };

  const handlePageChange = (url: string) => {
    fetchDogs({
      searchParams: {
        breeds,
        zipCodes,
        ageMin,
        ageMax,
        size: 25,
        sort: "asc",
      },
      urlOverride: `${process.env.REACT_APP_API_URL}${url}`,
    });
  };

  useEffect(() => {
    fetchDogs({ searchParams: { sort: "asc" } });
  }, [fetchDogs]);

  return (
    <div className="dogs">
      <form className="dog-search-form" onSubmit={handleSearch}>
        {breedData && (
          <div className="input-group">
            <label htmlFor="searchBreed">Search breed:</label>
            <Select
              id="searchBreed"
              options={breedData.map((option) => ({
                value: option,
                label: option,
              }))}
              isMulti
              isLoading={breedLoading}
              onChange={handleBreedChange}
              placeholder="Search breeds..."
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="searchCity">Search city</label>
          <input
            id="searchCity"
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="minAge">Minimum age:</label>
          <input
            type="number"
            id="minAge"
            placeholder="Min Age"
            onChange={(e) => setAgeMin(Number(e.target.value))}
            value={ageMin}
          />
          <label htmlFor="maxAge">Maximum age:</label>
          <input
            type="number"
            id="maxAge"
            placeholder="Max Age"
            onChange={(e) => setAgeMax(Number(e.target.value))}
            value={ageMax}
          />
        </div>
        <div className="input-group">
          <label htmlFor="breedSort">Order by breed</label>
          <Select
            id="breedSort"
            options={[
              { value: "asc", label: "ascending" },
              { value: "desc", label: "descending" },
            ]}
            defaultValue={{ value: "asc", label: "ascending" }}
            placeholder="Order by Breed"
            onChange={(option) => setSort(option ? option.value : "asc")}
          />
        </div>
        <button className="submit-button" type="submit">
          {dogsLoading ? "Searching..." : "🔍 Search Dogs"}
        </button>
      </form>
      <div className="dog-list">
        <LoadingErrorHandler
          isLoading={dogsLoading || isCityLoading}
          isError={isDogError || isBreedError || isCityError}
          error={dogError || breedError || cityError}
        >
          {dogData && (
            <DogPagination
              totalResults={dogData.total}
              nextPageUrl={dogData.next}
              prevPageUrl={dogData.prev}
              onPageChange={handlePageChange}
            />
          )}
          <div className="dog-section">
            {dogData &&
              dogData.dogs.map((dog) => (
                <div className="dog-card-wrapper" key={dog.id}>
                  <DogCard
                    dog={dog}
                    isFav={favorites.includes(dog.id)}
                    handleFavorite={handleFavorite}
                  />
                </div>
              ))}
          </div>
          {dogData && dogData.total > 25 && (
            <DogPagination
              totalResults={dogData.total}
              nextPageUrl={dogData.next}
              prevPageUrl={dogData.prev}
              onPageChange={handlePageChange}
            />
          )}
        </LoadingErrorHandler>
      </div>
    </div>
  );
}
