import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";

import { getDogBreeds, searchDogs } from "api-calls/dogs";
import Error from "components/Error";
import Loader from "components/Loader";

import DogCard from "./DogCard";
import DogPagination from "./DogPagination";

const base = "https://frontend-take-home-service.fetch.com";

export default function Dogs() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number>(0);
  const [ageMax, setAgeMax] = useState<number>(25);
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
    mutate,
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
        sort?: string;
      };
      urlOverride?: string;
    }) => searchDogs(searchParams, urlOverride),
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
    mutate({ searchParams: { breeds, zipCodes, ageMin, ageMax } });
  };

  const handleBreedChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
  ) => {
    setBreeds(selectedOptions.map((option) => option.value));
  };

  const handlePageChange = (url: string) => {
    mutate({
      searchParams: {
        breeds,
        zipCodes,
        ageMin,
        ageMax,
        size: 25,
        sort: "breed:asc",
      },
      urlOverride: base + url,
    });
  };

  useEffect(() => {
    mutate({});
  }, [mutate]);

  return (
    <div className="dogs">
      <form className="dog-search-form" onSubmit={handleSearch}>
        {breedData && (
          <Select
            options={breedData.map((option) => ({
              value: option,
              label: option,
            }))}
            isMulti
            isLoading={breedLoading}
            onChange={handleBreedChange}
            placeholder="Search breeds..."
          />
        )}
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter zip codes (comma separated)"
            onChange={(e) => setZipCodes(e.target.value.split(","))}
          />
        </div>

        <div className="input-group">
          <input
            type="number"
            placeholder="Min Age"
            onChange={(e) => setAgeMin(Number(e.target.value))}
            value={ageMin}
          />
          <input
            type="number"
            placeholder="Max Age"
            onChange={(e) => setAgeMax(Number(e.target.value))}
            value={ageMax}
          />
        </div>

        <button className="submit-button" type="submit">
          {dogsLoading ? "Searching..." : "🔍 Search Dogs"}
        </button>
      </form>
      <div className="dog-list">
        {isDogError && <Error message={dogError.message} />}
        {isBreedError && <Error message={breedError.message} />}
        {dogsLoading && <Loader />}
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
              <div
                key={dog.id}
                className="dog-card-wrapper"
                role="button"
                tabIndex={0}
                onClick={() => handleFavorite(dog.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleFavorite(dog.id);
                  }
                }}
              >
                <DogCard dog={dog} isFav={favorites.includes(dog.id)} />
              </div>
            ))}
        </div>
        {dogData && (
          <DogPagination
            totalResults={dogData.total}
            nextPageUrl={dogData.next}
            prevPageUrl={dogData.prev}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
