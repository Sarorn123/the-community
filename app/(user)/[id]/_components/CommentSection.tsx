"use client"

import { Textarea } from "@/components/ui/textarea"
import React, { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { CommentFullType, CreateComment } from "@/types/comment"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import CommentCard from "./CommentCard"

type Props = {
    totalComment: number
    questionId: string
    questionUserId: string
}

const CommentSection = ({
    totalComment,
    questionId,
    questionUserId,
}: Props) => {
    const { data: session } = useSession()
    const { toast } = useToast()

    const [getCommentLoading, setGetCommentLoading] = useState<boolean>(true)
    const [comments, setComments] = useState<CommentFullType[]>([])
    const [content, setContent] = useState<string>("")
    const [addingComment, setAddingComment] = useState<boolean>(false)
    const [contentErrorLength] = useState<number>(1000)

    async function getComments() {
        try {
            const response = await axios.get(
                "/api/comment?questionId=" + questionId,
            )
            setComments(response.data.comments)
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message)
            }
        } finally {
            setGetCommentLoading(false)
        }
    }

    useEffect(() => {
        getComments()
    }, [])

    async function addComment() {
        if (!session?.user.id)
            return toast({
                title: "Error ⚠",
                description: "please login first 🙏",
                variant: "destructive",
            })
        if (!content) return
        setAddingComment(true)
        const data: CreateComment = {
            content,
            questionId: questionId,
            userId: session.user.id,
        }

        try {
            await axios.post("/api/comment", data)
            toast({
                title: "Success 🎉🎉",
                description: "comment is add 👍",
            })
            setContent("")
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
            setAddingComment(false)
        }
    }

    return getCommentLoading ? (
        <div className="flex items-center  mt-3 lg:mt-0">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <h1>Getting Comment ...</h1>
        </div>
    ) : (
        <div className="mt-3">
            <h1 className="lg:text-lg font-semibold">{totalComment} Comment</h1>
            <p
                className={`text-sm flex justify-end ${
                    content.length >= contentErrorLength && "text-red-600"
                }`}
            >
                {content.length}/{contentErrorLength}
            </p>
            <Textarea
                placeholder="write a comment ..."
                className={`${
                    content.length >= contentErrorLength && "border-red-600"
                }`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <Button
                onClick={addComment}
                disabled={addingComment || content.length >= contentErrorLength}
                className="mt-3"
            >
                {addingComment && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Comment
            </Button>

            <div className="mt-5">
                {comments.map((comment: CommentFullType, index: number) => (
                    <CommentCard
                        key={index}
                        getComments={getComments}
                        id={comment.id}
                        userId={comment.userId}
                        userImage={comment.user.image || ""}
                        content={comment.content}
                        userName={comment.user.name || "User"}
                        isCorrect={comment.isCorrect}
                        replys={comment.replys}
                        createdAt={comment.createdAt}
                        questionUserId={questionUserId}
                    />
                ))}
            </div>
        </div>
    )
}

export default CommentSection
