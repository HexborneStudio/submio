import { LoadingSpinner } from "./LoadingSpinner";

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500 text-sm mt-3">{message}</p>
    </div>
  );
}
