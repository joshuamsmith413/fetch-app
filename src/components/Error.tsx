import React from "react";

import "styles/Error.css";

type Props = {
  message: string;
};

export default function Error({ message }: Props) {
  return (
    <div className="error-container">
      <h2 className="error-title">Oops! Something went wrong.</h2>
      <p className="error-message">{message}</p>
    </div>
  );
}
