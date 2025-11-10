import { FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@tanstack/react-router"

export function EmptyDemo({ title, url }: { title: string, url: string }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderIcon />
                </EmptyMedia>
                <EmptyTitle>No {title} Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any {title} yet. Get started by creating
                    your first {title}.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Link to={url}>
                        <Button>
                            Create {title}
                        </Button>
                    </Link>
                    {/* <Button variant="outline">Import Project</Button> */}
                </div>
            </EmptyContent>
        </Empty>
    )
}
