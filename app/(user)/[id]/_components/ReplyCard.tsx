"use client"

import DisplayStringWithLink from "@/components/DisplayStringWithLink"
import PopupDialog from "@/components/PopupDialog"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios"
import { Trash } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import React, { useState } from "react"
import moment from "moment"

type Props = {
    id: string
    userId: string
    userImage: string
    content: string
    userName: string
    createdAt: Date
    getComments: () => void
}

const ReplyCard = ({
    id,
    content,
    userImage,
    userName,
    userId,
    createdAt,
    getComments,
}: Props) => {
    const { data: session } = useSession()
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)

    const { toast } = useToast()

    async function deleteReply(action: boolean) {
        if (!action) return setOpenDialog(false)
        setDeleting(true)
        try {
            await axios.delete("/api/comment/reply/" + id)
            toast({
                title: "Success 🎉",
                description: "reply deleted 🤘",
            })
            getComments()
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Error ⚠😥",
                    description: error.message,
                    variant: "destructive",
                })
            }
        } finally {
            setDeleting(false)
            setOpenDialog(false)
        }
    }

    return (
        <div className="border-l border-t mt-3 pl-5 rounded-lg py-4">
            <PopupDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                description="This action cannot be undone. This will permanently delete this reply."
                loading={deleting}
                action={deleteReply}
            />
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src={userImage}
                            alt={userName}
                            className="rounded-full w-7 h-7 object-cover"
                            width={50}
                            height={50}
                        />
                        <p>
                            {userName} 📅
                            {moment(createdAt).format("DD-MMMM-YYYY")}
                        </p>
                    </div>
                    {session?.user.id === userId && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenDialog(true)}
                        >
                            <Trash size={12} className="text-red-600" />
                        </Button>
                    )}
                </div>
                <DisplayStringWithLink text={content} />
            </div>
        </div>
    )
}

export default ReplyCard
