import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

export function LoadScreen({ title }: { title: string }) {
    return (
        <div className="h-full flex items-center justify-center w-full">
        <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem] mx-auto">
            <Item variant="muted">
                <ItemMedia>
                    <Spinner />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle className="line-clamp-1">Processing {title}...</ItemTitle>
                </ItemContent>
            </Item>
        </div>
        </div>
    )
}
