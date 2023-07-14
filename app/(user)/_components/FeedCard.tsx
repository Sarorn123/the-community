"use client"

import React, { startTransition } from "react"
import { ArrowBigUpDash, ArrowBigDownDash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { VoteType } from "@prisma/client"
import VoteAction from "./VoteAction"

type Props = {
    id: string
    title: string
    content: string
    tages: string
    totalVote: number
    image: string | null
    totalComment: number
    voteType: VoteType
}

const FeedCard = ({
    id,
    title,
    content,
    tages,
    totalVote,
    totalComment,
    voteType,
    image,
}: Props) => {
    return (
        <div className="rounded-lg border px-4 py-2 lg:py-3 lg:px-6 mt-5 group transition">
            <Link href={"/" + id}>
                <h1 className="lg:text-lg font-semibold">{title}</h1>
                <p className="text-blue-600 text-sm font-semibold">{tages}</p>
                <pre className="my-3">{content}</pre>
                {image && (
                    <Image
                        src={image}
                        alt="test"
                        className="w-full rounded-lg"
                        width={300}
                        height={300}
                    />
                )}
            </Link>
            <div className="flex items-center mt-3 justify-between">
                <VoteAction id={id} totalVote={totalVote} voteType={voteType} />
                <p className="group-hover:underline">{totalComment} Comments</p>
            </div>
        </div>
    )
}

export default FeedCard
