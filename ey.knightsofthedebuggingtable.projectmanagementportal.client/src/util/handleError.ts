const handleError = (
  error: unknown,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  let errorMessage = "An unknown error occurred!";

  if (error instanceof Error) {
    const match = error.message.match(/:\s*(.*)/);
    errorMessage = match ? match[1] : error.message;
  }

  setError(errorMessage);
};

export const handleValidationErrors = (
  error: string[],
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  setError(error.join(", "));
};

export default handleError;
