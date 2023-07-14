import { addComment, getComments } from '@/controller/comment';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')
    if (!questionId) return NextResponse.json({ message: "questionId is required !" }, { status: HttpStatusCode.BadRequest })
    return await getComments(questionId)
}

export async function POST(request: NextRequest) {
    return await addComment(request)
}

