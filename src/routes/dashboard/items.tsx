import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getSavedItems } from "@/data/firecrawl";
import { clipboardHander } from "@/lib/clipboard";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/dashboard/items")({
	component: RouteComponent,
	loader: async () => await getSavedItems(),
});

function RouteComponent() {
	const savedItems = Route.useLoaderData();
	const [copying, startTransition] = useTransition();

	function handleCopyUrl(url: string) {
		startTransition(async () => {
			await clipboardHander(url);
			toast.success("Successfully Copied link to your clipboard");
		});
	}
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{savedItems.map((eachItem) => {
				return (
					<Card
						key={eachItem.id}
						className="group overflow-hidden transition-all duration-300 hover:shadow-lg  pt-0"
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
											eachItem.status === "COMPLETED" ? "default" : "secondary"
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
									{eachItem.author ?? "not author"}
								</p>
							)}
						</Link>
					</Card>
				);
			})}
		</div>
	);
}
