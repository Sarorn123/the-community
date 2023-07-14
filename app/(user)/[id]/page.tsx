import Image from "next/image"
import React from "react"
import CommentSection from "./_components/CommentSection"
import { prisma } from "../../../db/client"
import VoteAction from "../_components/VoteAction"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/option"
import DeleteQuestion from "./_components/DeleteQuestion"
import DisplayStringWithLink from "@/components/DisplayStringWithLink"

async function getQuestionDetail(id: string) {
    const session = await getServerSession(authOptions)
    const question = await prisma.question.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            _count: {
                select: {
                    comment: true,
                },
            },
            votes: {
                where: {
                    userId: session?.user.id || "",
                },
                select: {
                    voteType: true,
                },
            },
        },
    })

    if (!question) throw new Error("Not Found Question !")
    return question
}

const Page = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions)
    const question = await getQuestionDetail(params.id)

    return (
        <main className="container lg:flex gap-5 my-5  h-[80vh]">
            <div className="lg:w-1/2 flex justify-between">
                <div className="flex gap-5">
                    <VoteAction
                        id={params.id}
                        totalVote={question.totalVote}
                        voteType={question.votes[0]?.voteType}
                    />
                    <div>
                        <h1 className="lg:text-lg font-semibold">
                            {question.title}
                        </h1>
                        <p className="text-blue-600 text-sm font-semibold">
                            {question.tages}
                        </p>
                        <DisplayStringWithLink text={question.content || ""} />
                        {question.image && (
                            <Image
                                src={question.image}
                                alt={question.title}
                                className="rounded-lg w-full mt-3"
                                width={1000}
                                height={1000}
                            />
                        )}
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                            <Image
                                src={question.user.image || ""}
                                alt={question.user.name || ""}
                                className="rounded-full w-10 h-10 object-cover"
                                width={50}
                                height={50}
                            />
                            <p>{question.user.name}</p>
                        </div>
                    </div>
                </div>

                {session?.user.id === question.userId && (
                    <DeleteQuestion id={params.id} image={question.image} />
                )}
            </div>
            <div className=" lg:w-1/2">
                <CommentSection
                    questionId={params.id}
                    totalComment={question._count.comment}
                    questionUserId={question.userId}
                />
            </div>
        </main>
    )
}

export default Page
