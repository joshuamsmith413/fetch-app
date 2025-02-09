const loginURL = `${process.env.REACT_APP_API_URL}/auth/`;

const loginUser = async ({ name, email }: { name: string; email: string }) => {
  const response = await fetch(`${loginURL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response;
};

export const logoutUser = async () => {
  const response = await fetch(`${loginURL}logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response;
};

export default loginUser;
