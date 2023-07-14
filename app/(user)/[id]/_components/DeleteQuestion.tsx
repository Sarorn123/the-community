"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import React, { Fragment, useEffect, useState } from "react"
import PopupDialog from "@/components/PopupDialog"
import axios, { AxiosError, HttpStatusCode } from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { deleteFileFromSupabase } from "@/db/supabase"

type Props = {
    id: string
    image: string | null
}

const DeleteQuestion = ({ id, image }: Props) => {
    const { toast } = useToast()
    const router = useRouter()

    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)

    async function deleteAction(action: boolean) {
        if (!action) return setOpenDialog(false)
        setDeleting(true)

        try {
            if (image) await deleteFileFromSupabase(image)
            const response = await axios.delete("/api/question/" + id)
            if (response.status === HttpStatusCode.Ok) {
                toast({
                    title: "Delete Success",
                    description: "question is deleted",
                })
                router.push("/")
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Something Wrong",
                    description: error.response?.data.message,
                    variant: "destructive",
                })
            }
        } finally {
            setDeleting(false)
            setOpenDialog(false)
        }
    }

    return (
        <Fragment>
            <PopupDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                action={deleteAction}
                loading={deleting}
                description={
                    "This action cannot be undone. This will permanently delete this question."
                }
            />
            <Button variant="ghost" onClick={() => setOpenDialog(true)}>
                <Trash size={20} className="text-red-600" />
            </Button>
        </Fragment>
    )
}

export default DeleteQuestion
