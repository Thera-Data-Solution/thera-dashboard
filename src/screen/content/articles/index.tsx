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
      label: "Cover",
      render: (v, row) =>
        v ? (
          <img
            src={v as string}
            alt={row.title}
            className="w-12 h-12 object-cover rounded-md border"
          />
        ) : null,
    },
    { key: "title", label: "Title" },
    { key: "articleType", label: "Type" },
    {
      key: "createdAt",
      label: "Created",
      render: (v) => format(new Date(v as string), "dd/MM/yyyy"),
    },
  ];

  const imageKeys: (keyof IArticle) = "coverImage";

  const description: (keyof IArticle)[] = ["articleType"];
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
      variant: "outline" as const,
    },
  ];

  return (<KepsDataEntry<IArticle>
        title="Articles"
        caption="Pages & Blogs"
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
