import { addQuestion, voteAction } from '@/controller/question';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "This end point return nothing !" })
}

export async function POST(request: Request) {
    return await addQuestion(request);
}

export async function PATCH(request: Request) {
    return await voteAction(request);
}