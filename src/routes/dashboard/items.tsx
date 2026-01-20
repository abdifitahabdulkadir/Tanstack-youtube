import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSavedItems } from "@/data/firecrawl";
import { ItemStates } from "@/generated/prisma/enums";
import { clipboardHander } from "@/lib/clipboard";
import { SavedItemsSearchSchema } from "@/lib/validation";
import { zodValidator } from "@tanstack/zod-adapter";
import { Copy } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";


export const Route = createFileRoute("/dashboard/items")({
	component: RouteComponent,
  loader: async () => await getSavedItems(),
  validateSearch: zodValidator(SavedItemsSearchSchema)
});

function RouteComponent() {
  const savedItems = Route.useLoaderData();
	const { q ,status} = Route.useSearch();
  const [copying, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(q);
  const navigate=useNavigate({from:Route.fullPath})

  useEffect(() => {
    if (q === searchInput) return;
    const timeoutId = setTimeout(() => {
      navigate({search:(prev)=>({...prev,q:searchInput})})
    }, 300)

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

	function handleCopyUrl(url: string) {
		startTransition(async () => {
			await clipboardHander(url);
			toast.success("Successfully Copied link to your clipboard");
		});
	}


	const fitleredItmes= savedItems.filter((item) => {
    if (status === "all") return true;
    return item.status === status
  }).filter((each)=>each.title?.toLowerCase().includes(searchInput.toLowerCase()))



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
          onChange={(e)=>setSearchInput(e.target.value)}
					placeholder="Search By title or tags"
					className="px-2 py-3  border-blue-600"
				/>
        <Select value={status} onValueChange={(selectedStatus) => {
          navigate({
            search: (prev) => ({
              ...prev,
              status: selectedStatus as typeof status
            })
          })
        }}>
					<SelectTrigger className="w-40 rounded-2xl border-blue-500 border">
						<SelectValue placeholder="Select By Status" />
					</SelectTrigger>
					<SelectContent className="bg-background px-3 py-4  text-foreground">
						<SelectItem value="all">All States</SelectItem>
						{Object.values(ItemStates).map((eachStatus) => (
							<SelectItem key={eachStatus} value={eachStatus}>
								{eachStatus.charAt(0).toUpperCase() + eachStatus.slice(1).toLocaleLowerCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="grid gap-6 md:grid-cols-2">
				{fitleredItmes.map((eachItem) => {
					return (
						<Card
							key={eachItem.id}
							className="group overflow-hidden transition-all duration-300 hover:shadow-lg pt-0"
						>
							<Link to="/dashboard" className="block">
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
										<Badge
											variant={
												eachItem.status === "COMPLETED"
													? "default"
													: "secondary"
											}
										>
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
		</div>
	);
}
