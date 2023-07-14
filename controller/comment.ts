import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../db/client';
import { Prisma } from '@prisma/client';
import { HttpStatusCode } from 'axios';

export async function getComments(questionId: string) {
        const comments = await prisma.comment.findMany({
                where: {
                        questionId,
                },
                orderBy: {
                        createdAt: "desc"
                },
                include: {
                        user: true,
                        replys: {
                                include: {
                                        user: true
                                },
                                orderBy: {
                                        createdAt: "desc"
                                }
                        },
                },
        })

        return NextResponse.json({ comments })
}

export async function addComment(request: NextRequest) {
        try {
                const data = await request.json()
                const comment = await prisma.comment.create({
                        data
                })
                return NextResponse.json({ comment })

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

export async function deleteComment(id: string) {
        try {
                await prisma.comment.delete({
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

export async function addReply(request: NextRequest) {
        try {
                const data = await request.json()
                const reply = await prisma.reply.create({
                        data
                })
                return NextResponse.json({ reply })

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

export async function deleteReply(id: string) {
        try {
                await prisma.reply.delete({
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

export async function toggleCorrectComment(id: string) {


        try {
                const comment = await prisma.comment.findUnique({
                        where: {
                                id
                        },
                        select: {
                                isCorrect: true,
                                questionId: true
                        }
                })

                if (!comment) throw new Error("Comment Not Found !")

                const comments = await prisma.comment.findMany({
                        where: {
                                questionId: comment.questionId
                        }
                });

                await Promise.all(
                        comments.map(async comment => {
                                if (comment.isCorrect) {
                                        await prisma.comment.update({
                                                where: {
                                                        id: comment.id
                                                },
                                                data: {
                                                        isCorrect: false
                                                }
                                        })
                                }
                        })
                )

                await prisma.comment.update({
                        where: {
                                id
                        },
                        data: {
                                isCorrect: {
                                        set: !comment.isCorrect
                                }
                        }
                })
                return NextResponse.json({ comment })

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