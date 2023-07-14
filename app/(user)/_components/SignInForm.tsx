"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { signIn } from "next-auth/react"
import React from "react"

type Props = {
    openText: string
}

const SignInForm = ({ openText }: Props) => {
    async function signInWithGoogle() {
        await signIn("google", {
            callbackUrl: "/",
            redirect: false,
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={
                        openText === "Sign In" ? "" : "fixed right-5 bottom-5"
                    }
                >
                    {openText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <div className="mt-3">
                    <Button className="w-full" onClick={signInWithGoogle}>
                        Sign In With Google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInForm
