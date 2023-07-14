"use client"

import { useToast } from "@/components/ui/use-toast"
import { CreateVote } from "@/types/question"
import { VoteType } from "@prisma/client"
import axios, { HttpStatusCode } from "axios"
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { startTransition } from "react"

type Props = {
    id: string
    voteType: VoteType
    totalVote: number
}

const VoteAction = ({ id, voteType, totalVote }: Props) => {
    const { data: session } = useSession()
    const { toast } = useToast()
    const router = useRouter()

    async function voteAction(voteType: VoteType) {
        if (!session) {
            return toast({
                title: "Please Log In !",
                description: "to vote an question you need to login first !",
                variant: "destructive",
            })
        }

        const data: CreateVote = {
            userId: session?.user.id || "",
            questionId: id,
            voteType: voteType,
        }
        const response = await axios.patch("/api/question", data)
        if (response.status === HttpStatusCode.Ok) {
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
        }
    }

    return (
        <div className="flex flex-col items-center">
            <ArrowBigUpDash
                size={25}
                className={`cursor-pointer ${
                    voteType === VoteType.UP && "text-blue-600"
                }`}
                onClick={() => voteAction(VoteType.UP)}
            />
            <p>{totalVote}</p>
            <ArrowBigDownDash
                size={25}
                className={`cursor-pointer ${
                    voteType === VoteType.DOWN && "text-red-600"
                }`}
                onClick={() => voteAction(VoteType.DOWN)}
            />
        </div>
    )
}

export default VoteAction
