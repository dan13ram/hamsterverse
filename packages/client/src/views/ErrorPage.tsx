import { useRouteError, Link } from "react-router-dom";

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Error</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">
        <button className="rounded-md border-white border-2 p-2 hover:bg-white hover:text-black">
          Go Home
        </button>
      </Link>
    </div>
  );
}
