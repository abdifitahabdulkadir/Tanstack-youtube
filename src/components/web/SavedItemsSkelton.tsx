import { Skeleton } from "../ui/skeleton";

export default function SavedItemsSkelton() {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, i: number) => (
        <div
          key={i}
          className="group overflow-hidden transition-all duration-300 hover:shadow-lg pt-0 border rounded-md"
        >
          <div className="aspect-video overflow-hidden bg-muted">
            <Skeleton className="h-full w-full" />
          </div>

          <div className="space-y-4 p-3">
            <div className="flex justify-between items-center gap-3 w-full">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="text-lg px-2 leading-snug">
            <Skeleton className="h-5 w-3/4 rounded-md" />
          </div>

          <div className="px-2 py-2">
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
