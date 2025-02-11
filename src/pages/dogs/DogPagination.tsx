import React from "react";

import "styles/DogPagination.css";

type DogPaginationProps = {
  totalResults: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  onPageChange: (url: string) => void; // eslint-disable-line no-unused-vars
};

export default function DogPagination(props: DogPaginationProps) {
  const { totalResults, nextPageUrl, prevPageUrl, onPageChange } = props;
  return (
    <div className="pagination-container">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => prevPageUrl && onPageChange(prevPageUrl)}
        disabled={!prevPageUrl}
      >
        &laquo; Previous
      </button>
      <span className="total-results">Total Results: {totalResults}</span>
      <button
        type="button"
        className="pagination-btn"
        onClick={() => nextPageUrl && onPageChange(nextPageUrl)}
        disabled={!nextPageUrl || totalResults < 25}
      >
        Next &raquo;
      </button>
    </div>
  );
}
