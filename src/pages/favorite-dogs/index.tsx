import { useQueries } from "@tanstack/react-query";
import React, { useState } from "react";

import { fetchDogs, matchDogFromIds } from "api-calls/dogs";
import Error from "components/Error";
import LoadingErrorHandler from "components/LoadingErrorHandler";
import DogCard from "pages/dogs/DogCard";

export default function FavoriteDogs() {
  const [favoriteDogIds, setFavoriteDogIds] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: ["match-dog"],
        queryFn: () => matchDogFromIds(favoriteDogIds),
      },
      {
        queryKey: ["dogs", favoriteDogIds],
        queryFn: () => fetchDogs(favoriteDogIds),
      },
    ],
  });
  const [matchedDogQuery, favoriteDogsQuery] = queries;

  const {
    data: matchedDog,
    isLoading: isMatchedDogLoading,
    isError: isMatchedDogError,
    error: matchedDogError,
  } = matchedDogQuery;

  const {
    data: favoriteDogs,
    isLoading: isFavoriteDogsLoading,
    isError: isFavoriteDogsError,
    error: favoriteDogsError,
  } = favoriteDogsQuery;

  if (favoriteDogIds.length === 0) {
    return <Error message="Add dogs to your favorites to view them here." />;
  }

  const handleFavorite = (dogId: string) => {
    const updatedFavorites = favoriteDogIds.includes(dogId)
      ? favoriteDogIds.filter((fav) => fav !== dogId)
      : [...favoriteDogIds, dogId];

    setFavoriteDogIds(updatedFavorites);
  };

  return (
    <div className="favorites-container">
      <LoadingErrorHandler
        isError={isMatchedDogError || isFavoriteDogsError}
        error={matchedDogError || favoriteDogsError}
        isLoading={isMatchedDogLoading || isFavoriteDogsLoading}
      >
        {favoriteDogs &&
          matchedDog &&
          favoriteDogs.map((dog) => (
            <div key={dog.id} className="dog-card-wrapper">
              <DogCard
                dog={dog}
                isMatch={matchedDog.match === dog.id}
                isFav
                handleFavorite={handleFavorite}
              />
            </div>
          ))}
      </LoadingErrorHandler>
    </div>
  );
}
