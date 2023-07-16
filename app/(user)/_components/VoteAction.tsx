"use client"

import { useToast } from "@/components/ui/use-toast"
import { CreateVote } from "@/types/question"
import { VoteType } from "@prisma/client"
import axios, { AxiosError, HttpStatusCode } from "axios"
import { ArrowBigDownDash, ArrowBigUpDash, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { startTransition, useState } from "react"

type Props = {
    id: string
    voteType: VoteType
    totalVote: number
}

const VoteAction = ({ id, voteType, totalVote }: Props) => {
    const { data: session } = useSession()
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState<VoteType>()

    async function voteAction(voteType: VoteType) {
        if (!session?.user.id) {
            return toast({
                title: "Please Log In !",
                description: "to vote an question you need to login first !",
                variant: "destructive",
            })
        }

        const data: CreateVote = {
            userId: session.user.id,
            questionId: id,
            voteType: voteType,
        }
        try {
            setLoading(voteType)
            const response = await axios.patch("/api/question", data)
            if (response.status === HttpStatusCode.Ok) {
                startTransition(() => {
                    // Refresh the current route and fetch new data from the server without
                    // losing client-side browser or React state.
                    router.refresh()
                })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Error !",
                    description: error.message,
                    variant: "destructive",
                })
            }
        } finally {
            setLoading(undefined)
        }
    }

    return (
        <div className="flex flex-col items-center">
            {loading === VoteType.UP ? (
                <Loader2 className="animate-spin " size={15} />
            ) : (
                <ArrowBigUpDash
                    size={25}
                    className={`cursor-pointer ${
                        voteType === VoteType.UP && "text-blue-600"
                    }`}
                    onClick={() => voteAction(VoteType.UP)}
                />
            )}
            <p>{totalVote}</p>
            {loading === VoteType.DOWN ? (
                <Loader2 className="animate-spin " size={15} />
            ) : (
                <ArrowBigDownDash
                    size={25}
                    className={`cursor-pointer ${
                        voteType === VoteType.DOWN && "text-red-600"
                    }`}
                    onClick={() => voteAction(VoteType.DOWN)}
                />
            )}
        </div>
    )
}

export default VoteAction
