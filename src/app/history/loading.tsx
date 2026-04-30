export default function HistoryLoading() {
  return (
    <div className="px-4 pt-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-100 rounded w-20" />
      <div className="h-28 bg-gray-100 rounded-2xl" />
      <div className="h-6 bg-gray-100 rounded w-32" />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-11 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}
