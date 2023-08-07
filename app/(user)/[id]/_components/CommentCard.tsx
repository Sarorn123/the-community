"use client"

import { Input } from "@/components/ui/input"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { CreateReply, ReplyFullType } from "@/types/comment"
import ReplyCard from "./ReplyCard"
import { Reply } from "@prisma/client"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import PopupDialog from "@/components/PopupDialog"
import axios, { AxiosError } from "axios"
import { useToast } from "@/components/ui/use-toast"
import DisplayStringWithLink from "@/components/DisplayStringWithLink"
import { Loader2 } from "lucide-react"
import moment from "moment"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {
    id: string
    userId: string
    userImage: string
    userName: string
    content: string
    isCorrect: boolean
    replys: Reply[]
    createdAt: Date
    questionUserId: string
    getComments: () => Promise<void>
}

const CommentCard = ({
    id,
    userId,
    userImage,
    userName,
    content,
    isCorrect,
    replys,
    createdAt,
    questionUserId,
    getComments,
}: Props) => {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [actioning, setActioning] = useState<boolean>(false)
    const [showReply, setShowReply] = useState<boolean>(false)
    const [addingReply, setAddingReply] = useState<boolean>(false)
    const [reply, setReply] = useState<string>("")
    const [replyErrorLength] = useState<number>(1000)
    const fullTypeReply = replys as ReplyFullType[]
    // const [checkBox, setCheckBox] = useState<boolean>(false)
    // const [isToggling, setIsToggling] = useState<boolean>(false)

    async function deleteComment(action: boolean) {
        if (!action) return setOpenDialog(false)
        setActioning(true)
        try {
            await axios.delete("/api/comment/" + id)
            toast({
                title: "Success 🎉",
                description: "comment deleted 🤘",
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
            setActioning(false)
            setOpenDialog(false)
        }
    }

    async function addReply(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            if (!session) {
                toast({
                    title: "Error ⚠",
                    description: "Please Login First 😦☹",
                    variant: "destructive",
                })
            }
            if (!reply || reply.length >= replyErrorLength) return
            setAddingReply(true)
            const data: CreateReply = {
                content: reply,
                commentId: id,
                userId: session?.user.id || "",
            }

            try {
                await axios.post("/api/comment/reply", data)
                toast({
                    title: "Success 🎉",
                    description: "comment is add 👍🙏",
                })
                setReply("")
                getComments()
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast({
                        title: "Error ⚠",
                        description: error.message,
                        variant: "destructive",
                    })
                }
            } finally {
                setAddingReply(false)
                setShowReply(false)
            }
        }
    }

    async function onToggleCorrectComment() {
        setActioning(true)
        try {
            await axios.patch("/api/comment/" + id)
            await getComments()
            toast({
                title: "Success 🎉",
                description: "action completed 👍🙏",
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Error ⚠",
                    description: error.message,
                    variant: "destructive",
                })
            }
        } finally {
            setActioning(false)
        }
    }

    return (
        <div className="border rounded-lg p-3 lg:p-5 mt-3">
            <PopupDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                description="This action cannot be undone. This will permanently delete this comment."
                loading={actioning}
                action={deleteComment}
            />

            <div className="flex items-center justify-between">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                        <Image
                            src={userImage}
                            alt="test"
                            className="rounded-full w-10 h-10 object-cover"
                            width={50}
                            height={50}
                        />
                        <p>{userName}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        {isCorrect && session?.user.id !== questionUserId && (
                            <Checkbox checked disabled />
                        )}
                        {actioning ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            session?.user.id === questionUserId && (
                                <Checkbox
                                    checked={isCorrect}
                                    onClick={onToggleCorrectComment}
                                />
                            )
                        )}
                        {session?.user.id === userId && (
                            <Button
                                variant="ghost"
                                onClick={() => setOpenDialog(true)}
                                disabled={actioning}
                            >
                                <Trash size={15} className="text-red-600" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <DisplayStringWithLink text={content} />

            <p className="mt-3 flex justify-end">
                📅 {moment(createdAt).format("DD-MMMM-YYYY")}
            </p>

            {showReply ? (
                <div className="flex items-center gap-3">
                    {addingReply ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <p
                            className="text-red-600 cursor-pointer"
                            onClick={() => setShowReply(false)}
                        >
                            Cancel
                        </p>
                    )}
                    <Input
                        placeholder="write a reply ..."
                        className={`mt-2 ${
                            reply.length >= replyErrorLength && "border-red-600"
                        }`}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={addReply}
                    />
                </div>
            ) : (
                <p
                    className=" inline-block underline cursor-pointer transition"
                    onClick={() => setShowReply(true)}
                >
                    Reply
                </p>
            )}

            {fullTypeReply.map((reply: ReplyFullType, index: number) => (
                <ReplyCard
                    key={index}
                    id={reply.id}
                    userId={reply.userId}
                    content={reply.content}
                    userImage={reply.user.image || ""}
                    userName={reply.user.name || ""}
                    createdAt={reply.createdAt}
                    getComments={getComments}
                />
            ))}
        </div>
    )
}

export default CommentCard
