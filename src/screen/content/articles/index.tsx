"use client"

import {useNavigate} from "@tanstack/react-router";
import {format} from "date-fns";
import type {ColumnDef} from "@tanstack/react-table";
import {DataTableArticle} from "@/screen/content/articles/dataTable.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {PlusIcon} from "lucide-react";

interface IArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImage: string;
    articleType: string;
    createdAt: string;
    updatedAt: string;
}

export default function ArticleClient({data}: { data: IArticle[] }) {
    const router = useNavigate()

    const articlesColumns: ColumnDef<IArticle>[] = [
        {
            accessorKey: "id",
            header: "Article Info",
            cell: ({row}) => {
                const coverImage = row.original.coverImage;
                return (
                    <div className={'flex items-center gap-3'}>
                        <img src={coverImage} alt="cover" className="w-12 h-12 rounded-md border"/>
                        <div className="flex flex-col">
                            <span className="font-medium">{row.original.title}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {row.original.excerpt}
                            </span>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({row}) => format(new Date(row.original.createdAt), "dd/MM/yyyy")
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({row}) => format(new Date(row.original.updatedAt), "dd/MM/yyyy")
        },
        {
            accessorKey: "articleType",
            header: "Type",
        },
        {
            accessorKey: "id",
            header: "Action",
            cell: ({row}) => {
                return (
                    <div>
                        <Button
                            onClick={() => router({to: "/app/content/article/update/$arId", params: {arId: row.original.id}})}>
                            Edit
                        </Button>
                    </div>
                )
            }
        }
    ]

    return (<div>
            <h1 className="text-2xl font-bold mb-4">List Articles</h1>
            <DataTableArticle columns={articlesColumns} data={data}/>
            <div className="fixed bottom-6 right-6">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => router({
                                    to: '/app/content/article/new',
                                    replace: false
                                })}
                                variant="ghost"
                                size="lg"
                                className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            >
                                <PlusIcon className="h-8 w-8"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add new article</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}
