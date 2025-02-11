import React from "react";

import "styles/DogCard.css";

type TDog = {
  img: string;
  name: string;
  age: number;
  breed: string;
  zipCode: string;
  id: string;
};

type Props = {
  dog: TDog;
  isFav: boolean;
  isMatch?: boolean;
  handleFavorite: (id: string) => void;
};

export default function DogCard({
  dog,
  isFav,
  isMatch,
  handleFavorite,
}: Props) {
  const { id, name, img, age, breed, zipCode } = dog;
  return (
    <div className={`dog-card ${isMatch ? "matched" : ""}`}>
      <div
        className="fav-container"
        role="button"
        tabIndex={0}
        onClick={() => handleFavorite(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleFavorite(id);
          }
        }}
      >
        {isFav ? "❤️" : "🤍"}
      </div>
      {isMatch && <div className="match-banner">It&apos;s a Match!</div>}
      <h3 className="dog-name">{name}</h3>
      <img className="dog-img" src={img} alt={name} />
      <p className="dog-age">Age: {age}</p>
      <p className="dog-breed">Breed: {breed}</p>
      <p className="dog-zip">Zip Code: {zipCode}</p>
    </div>
  );
}
