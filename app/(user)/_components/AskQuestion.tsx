"use client"

import React, { startTransition, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import SignInForm from "./SignInForm"
import { uploadFileToSupabase } from "@/db/supabase"
import axios, { AxiosError, HttpStatusCode } from "axios"
import { CreateQuestion } from "@/types/question"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const AskQuestion = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()
    const [file, setFile] = useState<File>()
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [tages, setTages] = useState<string>("")
    const [adding, setAdding] = useState<boolean>(false)
    const [dialog, setDialog] = useState<boolean>(false)

    function clear() {
        setFile(undefined)
        setTitle("")
        setContent("")
        setTages("")
    }

    async function askQuestion() {
        if (title === "" || content === "") return

        setAdding(true)
        let image: string = ""

        if (file) {
            image = await uploadFileToSupabase(file)
        }

        const data: CreateQuestion = {
            title,
            content,
            tages,
            image,
            totalVote: 0,
            userId: session?.user.id || "",
        }
        const response = await axios.post("/api/question", data)
        try {
            if (response.status === HttpStatusCode.Created) {
                toast({
                    title: "Ask Success",
                    description: title,
                })
            }

            startTransition(() => {
                router.refresh()
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Something Error",
                    description: error.message,
                    variant: "destructive",
                })
            }
        } finally {
            clear()
            setAdding(false)
            setDialog(false)
        }
    }

    return session ? (
        <Dialog open={dialog} onOpenChange={setDialog}>
            <DialogTrigger asChild>
                <Button className="fixed right-5 bottom-5">Ask</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ask a question</DialogTitle>
                    <DialogDescription>
                        you can ask anything you want here
                    </DialogDescription>
                </DialogHeader>
                <div className="">
                    <Input
                        type="text"
                        className="mt-5"
                        placeholder="Title ..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        id="name"
                        className="mt-5"
                        placeholder="What's your problem ?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Input
                        type="file"
                        className="mt-5"
                        onChange={(e) => setFile(e.target.files![0])}
                    />
                    <Input
                        type="text"
                        className="mt-5"
                        placeholder="tages etc - react,auth,fixed"
                        value={tages}
                        onChange={(e) => setTages(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    {adding ? (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" onClick={askQuestion}>
                            Ask
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ) : (
        <SignInForm openText="Ask" />
    )
}

export default AskQuestion
