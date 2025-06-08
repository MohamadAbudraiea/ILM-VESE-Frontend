import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <span className="text-9xl font-bold text-primary">404</span>
          <div className="mt-4 text-5xl font-bold text-neutral">Oops!</div>
        </div>

        <p className="mb-8 text-xl text-neutral/80">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn btn-primary text-base-100 hover:bg-primary/90"
          >
            Go Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-secondary hover:text-base-100"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
