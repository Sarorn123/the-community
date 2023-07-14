import { addReply, deleteReply } from '@/controller/comment';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    return await addReply(request)
}
