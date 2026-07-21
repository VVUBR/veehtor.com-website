import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSiteContent } from "@/i18n/siteContent";

const NotFound = () => {
  const location = useLocation();
  const { notFound: N } = useSiteContent();

  useEffect(() => {
    document.title = N.metaTitle;
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, N.metaTitle]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{N.heading}</h1>
        <p className="mb-4 text-xl text-gray-600">{N.body}</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          {N.back}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
