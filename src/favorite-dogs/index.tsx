import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { fetchDogs, matchDogFromIds } from "api-calls/dogs";
import Error from "components/Error";
import Loader from "components/Loader";
import DogCard from "dogs/DogCard";

export default function FavoriteDogs() {
  const [favoriteDogIds, setFavoriteDogIds] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const { data: favoriteDogData, isLoading: favoriteLoading } = useQuery({
    queryKey: ["match-dogs"],
    queryFn: () => matchDogFromIds(favoriteDogIds),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dogs", favoriteDogIds],
    queryFn: () => fetchDogs(favoriteDogIds),
  });

  if (!favoriteDogIds) {
    return <p>no favorites</p>;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

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
      {(isLoading || favoriteLoading) && <Loader />}
      {data &&
        favoriteDogData &&
        data.map((dog) => (
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
            <DogCard
              dog={dog}
              isMatch={favoriteDogData.match === dog.id}
              isFav
            />
          </div>
        ))}
    </div>
  );
}
