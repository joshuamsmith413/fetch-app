const loginURL = 'https://frontend-take-home-service.fetch.com/auth/login';

const loginUser = async ({ name, email }: { name: string; email: string }) => {
  const response = await fetch(loginURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response;
};

export default loginUser;
