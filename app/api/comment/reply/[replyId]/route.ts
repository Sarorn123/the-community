import { deleteReply } from '@/controller/comment';

export async function DELETE(request: Request, { params }: { params: { replyId: string } }) {
    return await deleteReply(params.replyId);
}