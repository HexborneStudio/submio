interface Props {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, retry }: Props) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">{message}</p>
      {retry && (
        <button onClick={retry} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
          Try Again
        </button>
      )}
    </div>
  );
}
