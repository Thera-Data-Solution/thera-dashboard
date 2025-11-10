import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, XCircle } from "lucide-react"
import type { IBooking } from "@/types"

interface BookingCardProps {
    data: IBooking
    onDelete: (id: string) => void
    onClose: (id: string) => void
}

export function BookingCard({ data, onDelete, onClose }: BookingCardProps) {
    const user = data.user
    const cat = data.schedule.categories
    const scheduleDate = new Date(data.schedule.dateTime)
    const bookedAt = new Date(data.bookedAt)

    return (
        <Card className="w-full shadow-sm border border-border">
            <CardHeader className="flex flex-row items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <CardTitle className="text-base">{user.fullName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                    <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                        <p className="font-semibold">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.location}</p>
                    </div>
                </div>

                <div className="text-sm">
                    <p>
                        <span className="font-medium">Jadwal:</span>{" "}
                        {scheduleDate.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}{" "}
                        -{" "}
                        {scheduleDate.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p>
                        <span className="font-medium">Booking At:</span>{" "}
                        {bookedAt.toLocaleDateString("id-ID")}{" "}
                        {bookedAt.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <Badge
                    variant={
                        data.schedule.status === "BOOKED" ? "destructive" : "default"
                    }
                >
                    {data.schedule.status}
                </Badge>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(data.id)}
                >
                    <Trash2 className="h-4 w-4 mr-1" /> Hapus
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onClose(data.id)}
                >
                    <XCircle className="h-4 w-4 mr-1" /> Tutup
                </Button>
            </CardFooter>
        </Card>
    )
}
