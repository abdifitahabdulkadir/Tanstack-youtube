import { createFileRoute, useNavigate } from "@tanstack/react-router";

import SaveItems from "@/components/SaveItems";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SavedItemsSkelton from "@/components/web/SavedItemsSkelton";
import { getSavedItems } from "@/data/firecrawl";
import { ItemStates } from "@/generated/prisma/enums";
import { SavedItemsSearchSchema } from "@/lib/validation";
import { zodValidator } from "@tanstack/zod-adapter";
import { Suspense, useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/items/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Saved Items | Recall",
      },
      {
        property: "og:title",
        content: "Saved Items",
      },
    ],
  }),
  loader: () => ({ getItems: getSavedItems() }),
  validateSearch: zodValidator(SavedItemsSearchSchema),
});

function RouteComponent() {
  const { getItems } = Route.useLoaderData();
  const { q, status } = Route.useSearch();

  const [searchInput, setSearchInput] = useState(q);
  const navigate = useNavigate({ from: Route.fullPath });

  useEffect(() => {
    if (q === searchInput) return;
    const timeoutId = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: searchInput }) });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-2xl">Saved Items</h2>
        <p className="text-muted-foreground">
          Your saved articles and contents
        </p>
      </div>
      <div className="gap-4  flex justify-between ">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search By title or tags"
          className="px-2 py-3  border-blue-600"
        />
        <Select
          value={status}
          onValueChange={(selectedStatus) => {
            navigate({
              search: (prev) => ({
                ...prev,
                status: selectedStatus as typeof status,
              }),
            });
          }}
        >
          <SelectTrigger className="w-40 rounded-2xl border-blue-500 border">
            <SelectValue placeholder="Select By Status" />
          </SelectTrigger>
          <SelectContent className="bg-background px-3 py-4  text-foreground">
            <SelectItem value="all">All States</SelectItem>
            {Object.values(ItemStates).map((eachStatus) => (
              <SelectItem key={eachStatus} value={eachStatus}>
                {eachStatus.charAt(0).toUpperCase() +
                  eachStatus.slice(1).toLocaleLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Suspense fallback={<SavedItemsSkelton />}>
        <SaveItems
          searchInput={searchInput}
          status={status}
          getItems={getItems}
        />
      </Suspense>
    </div>
  );
}
