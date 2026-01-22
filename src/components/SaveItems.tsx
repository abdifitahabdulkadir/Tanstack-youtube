import type { getSavedItems } from "@/data/firecrawl";
import { clipboardHander } from "@/lib/clipboard";
import type { SavedItemsSearchType } from "@/lib/validation";
import { Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { use, useTransition } from "react";
import toast from "react-hot-toast";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle } from "./ui/card";

interface Props {
  searchInput: string;
  status: SavedItemsSearchType["status"];
  getItems: ReturnType<typeof getSavedItems>;
}

export default function SaveItems({ searchInput, status, getItems }: Props) {
  const items = use(getItems);
  const [copying, startTransition] = useTransition();

  const fitleredItmes = items.filter((item) => {
    const query = searchInput.toLowerCase();
    const matchesQuery = (item.title ?? "").toLowerCase().includes(query);
    const matchesStatus = status === "all" ? true : item.status === status;

    return matchesStatus && matchesQuery;
  });

  function handleCopyUrl(url: string) {
    startTransition(async () => {
      await clipboardHander(url);
      toast.success("Successfully Copied link to your clipboard");
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {fitleredItmes.map((eachItem) => {
        const variant =
          eachItem.status === "COMPLETED" ? "default" : "secondary";

        return (
          <Card
            key={eachItem.id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg pt-0"
          >
            <Link
              to="/dashboard/items/$itemId"
              params={{
                itemId: eachItem.id,
              }}
              className="block"
            >
              {eachItem.ogImage && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    src={eachItem.ogImage}
                    alt={eachItem.title ?? "Thumbnail image"}
                  />
                </div>
              )}
              <CardHeader className="space-y-4 p-3">
                <div className="flex  justify-between items-center gap-3 w-full">
                  <Badge variant={variant}>
                    {eachItem.status.toLowerCase()}
                  </Badge>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopyUrl(eachItem.url);
                    }}
                    variant={"outline"}
                    size={"icon"}
                    className="size-8"
                  >
                    {copying ? "Copying..." : <Copy className="size-4" />}
                  </Button>
                </div>
              </CardHeader>

              <CardTitle className="text-lg px-2 line-clamp-1 group-hover:text-primary transition-colors will-change-[color] leading-snug">
                {eachItem.title}
              </CardTitle>
              {eachItem.author && (
                <p className="text-xs p-2 text-muted-foreground">
                  {eachItem.author}
                </p>
              )}
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
