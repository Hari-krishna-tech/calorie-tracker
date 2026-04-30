export default function AddLoading() {
  return (
    <div className="px-4 pt-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-100 rounded w-20" />
      <div className="h-12 bg-gray-100 rounded-xl" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );
}
