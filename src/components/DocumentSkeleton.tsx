export const DocumentSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-3/5" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>

      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-7 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/5" />
          </div>
        </div>
      ))}

      {/* Diagram Placeholder */}
      <div className="h-64 bg-muted rounded-xl flex items-center justify-center">
        <div className="w-16 h-16 bg-muted-foreground/20 rounded" />
      </div>

      {/* Table Placeholder */}
      <div className="space-y-2">
        <div className="h-10 bg-muted rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-muted/50 rounded" />
        ))}
      </div>
    </div>
  );
};
