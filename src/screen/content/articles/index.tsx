"use client"
import { KepsDataEntry, type Column } from "@/components/data-grid";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Plus } from "lucide-react";

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

export default function ArticleClient({ data }: { data: IArticle[] }) {
    const router = useNavigate()


    const columns: Column<IArticle, keyof IArticle>[] = [
        {
            key: "coverImage",
            label: "Cover Image",
            render: (v) => v ? <img src={v as string} width={50} height={50} alt={v as string} /> : null
        },
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "excerpt", label: "Excerpt" },
        { key: "articleType", label: "Type" },
        { key: "createdAt", label: "Created At", render: (v) => format(new Date(v as string), "dd/MM/yyyy") },
        { key: "updatedAt", label: "Updated At", render: (v) => format(new Date(v as string), "dd/MM/yyyy") },
    ];

    const imageKeys: (keyof IArticle) = "coverImage";

    const description: (keyof IArticle)[] = ["title", "slug", "excerpt", "createdAt", "updatedAt", "articleType"];
    const newBlog = () => {
        router({
            to: '/app/content/article/new',
            replace: true
        })
    }
    const helpButton = [
        {
            key: "new",
            label: "New Blog",
            action: newBlog,
            icon: <Plus />
        }
    ]

    const actionButtons = [
        {
            key: "Detail",
            label: "Edit",
            action: (row: IArticle) => router({ to: "/app/content/article/update/$arId", params: { arId: row.id } }),
            variant: "destructive" as const,
        },
    ];

    return (<KepsDataEntry<IArticle>
        title="Articles Management"
        caption="Manage Pages & Blogs"
        data={data}
        imageKeys={imageKeys}
        imageType="banner"
        columns={columns}
        titleKey="title"
        descriptionKeys={description}
        actionButtons={actionButtons}
        helpButton={helpButton}
    />)
}