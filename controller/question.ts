import { NextResponse } from 'next/server';
import { prisma } from '../db/client';
import { HttpStatusCode } from 'axios';
import { CreateVote } from '@/types/question';
import { Prisma, VoteType } from '@prisma/client';
import { getServerSession } from 'next-auth';

export async function getSingleQuestion(id: string) {
    try {
        const post = await prisma.question.findFirst({
            where: { id }
        })
        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: HttpStatusCode.BadRequest })
    }
}

export async function addQuestion(request: Request) {
    try {
        const body = await request.json()

        const question = await prisma.question.create({
            data: body
        })
        return NextResponse.json({ question }, {
            status: HttpStatusCode.Created
        })
    } catch (error: any) {
        let message = "Server Error Please Try Again !";
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            message = error.message
        }
        return NextResponse.json({
            message: message,
        }, {
            status: HttpStatusCode.BadRequest
        })
    }
}

export async function voteAction(request: Request) {
    try {
        const { userId, questionId, voteType }: CreateVote = await request.json()
        const existed = await prisma.vote.findFirst({
            where: {
                userId,
                questionId,
            }
        });
        if (existed) {
            if (existed.voteType === VoteType.UP) {
                if (voteType === VoteType.UP) {
                    return NextResponse.json({ message: "Voted" }, {
                        status: HttpStatusCode.Ok
                    })
                }
                await prisma.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        totalVote: {
                            decrement: 1
                        }
                    }
                })
            } else {
                if (voteType === VoteType.DOWN) {
                    return NextResponse.json({ message: "Voted" }, {
                        status: HttpStatusCode.Ok
                    })
                }
                await prisma.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        totalVote: {
                            increment: 1
                        }
                    }
                })
            }

            await prisma.vote.delete({
                where: {
                    id: existed.id
                }
            })
        } else {

            if (voteType === VoteType.UP) {
                await prisma.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        totalVote: {
                            increment: 1
                        }
                    }
                })
            } else {
                await prisma.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        totalVote: {
                            decrement: 1
                        }
                    }
                })
            }

            await prisma.vote.create({
                data: {
                    userId,
                    questionId,
                    voteType
                }
            })
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            },
            include: {
                _count: {
                    select: {
                        comment: true
                    }
                }
            },
        })

        return NextResponse.json({ question }, {
            status: HttpStatusCode.Ok
        })
    } catch (error) {
        let message = "Server Error Please Try Again !";
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            message = error.message
        }
        return NextResponse.json({
            message: message,
        }, {
            status: HttpStatusCode.BadRequest
        })
    }
}

export async function deleteQuestion(id: string) {
    try {
        await prisma.question.delete({
            where: { id }
        })
        return NextResponse.json({ message: "Delete Success" })
    } catch (error) {
        let message = "Server Error Please Try Again !";
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            message = error.message
        }
        return NextResponse.json({
            message: message,
        }, {
            status: HttpStatusCode.BadRequest
        })
    }
}