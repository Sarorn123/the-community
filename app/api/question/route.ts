import { addQuestion, voteAction } from '@/controller/question';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../db/client';

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
    return await addQuestion(request);
}

export async function PATCH(request: Request) {
    return await voteAction(request);
}