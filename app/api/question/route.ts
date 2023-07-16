import { addQuestion, voteAction } from '@/controller/question';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/option';


export async function GET(request: NextRequest) {
    // const result = await prisma.vote.findMany({
    //     include: {
    //         user: {
    //             select: {
    //                 name: true
    //             }
    //         },
    //         question: {
    //             select: {
    //                 title: true
    //             }
    //         }
    //     }
    // })
    // try {
    //     const result = await prisma.vote.deleteMany({
    //     })
    //     return NextResponse.json({ result })
    // } catch (error) {
    //     console.log(error)
    // }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Please Login" }, {
        status: 400
    })
    return await addQuestion(request);
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Please Login" }, {
        status: 400
    })
    return await voteAction(request);
}