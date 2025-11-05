"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, PlusIcon } from "lucide-react";
import {
    Card,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Route } from "@/routes/app.event.categories.index";
import { deleteCategory } from "@/api/categories";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Category = {
    id: string;
    name: string;
    description: string | null;
    descriptionEn: string | null;
    image: string | null;
    start: number;
    end: number;
    price: number | null;
    isGroup: boolean;
    isFree: boolean;
    isPayAsYouWish: boolean;
    isManual: boolean;
    disable: boolean;
};

export default function CategoryClient({ categories }: { categories: Category[] }) {
    const navigate = useNavigate()
    const [show, setShow] = useState<boolean>(false);
    const queryClient = Route.useRouteContext().queryClient
    const { mutate, isPending } = useMutation({
        mutationFn: async (id: string) => {
            return await deleteCategory(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            toast.success("Category deleted successfully");
        }
    })

    return (
        <div className="w-full pt-6">
            <div className="space-y-4">
                {categories.map((item) => (
                    <Card key={item.id} className={`p-4 ${item.disable ? "opacity-60" : ""}`}>
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 items-center">
                            {/* Image and basic info section */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="relative w-40 h-24 sm:w-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-center md:text-left">
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <CardDescription className="text-sm">
                                        {item.description || item.descriptionEn}
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Accordion for details */}
                            <Accordion type="single" collapsible className="w-full md:hidden">
                                <AccordionItem value="item-1">
                                    {!show && (
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Duration</TableCell>
                                                    <TableCell>{item.start} - {item.end} minutes</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Price</TableCell>
                                                    <TableCell>
                                                        {item.isFree
                                                            ? <Badge variant="secondary">Free</Badge>
                                                            : (item.price ?? 0).toLocaleString("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            })}
                                                    </TableCell>
                                                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none rounded-b-md" />
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    )}

                                    <AccordionTrigger className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" onClick={() => setShow(!show)}>
                                        View Details
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Duration</TableCell>
                                                    <TableCell>{item.start} - {item.end} minutes</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Price</TableCell>
                                                    <TableCell>
                                                        {item.isFree
                                                            ? <Badge variant="secondary">Free</Badge>
                                                            : (item.price ?? 0).toLocaleString("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            })}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Manual Select</TableCell>
                                                    <TableCell>{item.isManual ? "Yes" : "No"}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Pay As You Wish</TableCell>
                                                    <TableCell>{item.isPayAsYouWish ? "Yes" : "No"}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Group</TableCell>
                                                    <TableCell>{item.isGroup ? "Yes" : "No"}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Disable</TableCell>
                                                    <TableCell>{item.disable ? "Yes" : "No"}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* Table for larger screens */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-semibold">Duration</TableCell>
                                            <TableCell>{item.start} - {item.end} minutes</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">Price</TableCell>
                                            <TableCell>
                                                {item.isFree
                                                    ? <Badge variant="secondary">Free</Badge>
                                                    : (item.price ?? 0).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">Manual Select</TableCell>
                                            <TableCell>{item.isManual ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">Pay As You Wish</TableCell>
                                            <TableCell>{item.isPayAsYouWish ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">Group</TableCell>
                                            <TableCell>{item.isGroup ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">Disable</TableCell>
                                            <TableCell>{item.disable ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Action buttons section */}
                            <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <Link to="/app/event/categories/update/$catId" params={{
                                    catId: item.id
                                }} className="w-full">
                                    <Button variant="secondary" className="w-full">
                                        <Pencil className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    className="w-full"
                                    type="submit"
                                    variant="destructive"
                                    disabled={isPending}
                                    onClick={() => mutate(item.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </Button>
                                <div className="fixed bottom-6 right-6">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={()=>navigate({
                                                        to: '/app/event/categories/new',
                                                        replace: false
                                                    })}
                                                    variant="ghost"
                                                    size="lg"
                                                    className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                                >
                                                    <PlusIcon className="h-8 w-8" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Add new category</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}