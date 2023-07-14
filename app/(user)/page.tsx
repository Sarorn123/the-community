import { Fragment } from "react"
import FeedCard from "./_components/FeedCard"
import TopicList from "./_components/TopicList"
import PolicyAndCommunity from "./_components/PolicyAndCommunity"
import AskQuestion from "./_components/AskQuestion"
import { QuestionFullType } from "@/types/question"
import { prisma } from "../../db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/option"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Prisma } from "@prisma/client"
import { Metadata } from "next"

export const fetchCache = "force-no-store"
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'

export const metadata: Metadata = {
    title: "The Community",
    description:
        "the community is a website for asking question people will come here and try to answer your question",
}

async function fetchPosts(search: string) {
    const session = await getServerSession(authOptions)

    let where: Prisma.QuestionWhereInput = {}
    if (search) {
        where = {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    tages: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }
    }

    const questions: QuestionFullType = await prisma.question.findMany({
        where,
        include: {
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
        orderBy: {
            createdAt: "desc",
        },
    })

    return questions
}

export default async function Page(params: {
    searchParams: { search: string }
}) {
    const { search } = params.searchParams
    const questions: QuestionFullType[] = await fetchPosts(search)
    return (
        <Fragment>
            <main className="container lg:my-3 flex justify-between">
                {/* left bar */}
                <section className="h-[85vh] px-4 py-2 w-[15%] sticky top-[5rem] hidden lg:block">
                    <h1 className="font-semibold">Topic</h1>
                    <TopicList />
                </section>

                {/* feed */}
                <section className="w-full md:w-[70%] lg:w-1/2">
                    {questions.length === 0 && (
                        <div className="flex items-center gap-2 justify-center mt-20">
                            <p>No Result !</p>
                            <Button variant="outline" asChild>
                                <Link href={"/"}>Back</Link>
                            </Button>
                        </div>
                    )}
                    {questions.map((feed: QuestionFullType, index: number) => (
                        <FeedCard
                            key={index}
                            id={feed.id}
                            title={feed.title}
                            content={feed.content || ""}
                            image={feed.image}
                            tages={feed.tages}
                            totalComment={feed._count.comment}
                            totalVote={feed.totalVote}
                            voteType={feed.votes[0]?.voteType}
                        />
                    ))}
                </section>
                {/* policy */}
                <PolicyAndCommunity />
            </main>
            <AskQuestion />
        </Fragment>
    )
}
