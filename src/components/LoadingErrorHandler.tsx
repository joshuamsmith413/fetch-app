import React from "react";

import Error from "components/Error";
import Loader from "components/Loader";

export default function LoadingErrorHandler({
  isLoading,
  isError,
  error,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any; // typescript not accept unknown even if instanceof Error
  children: React.ReactNode;
}) {
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
