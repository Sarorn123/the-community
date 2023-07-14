import { Button } from "@/components/ui/button"
import Link from "next/link"
import React, { Fragment } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const ShadCn = () => {
    return (
        <Fragment>
            <div className="p-10">
                <Button asChild>
                    <Link href="">Somewhere</Link>
                </Button>
                <DropdownMenu>
                    <br />
                    <DropdownMenuTrigger>
                        <Button variant="outline">Open Drop</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Input */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input type="email" id="email-2" placeholder="Email" />
                    <p className="text-sm text-muted-foreground">
                        Enter your email address.
                    </p>
                </div>
                {/* Dialog  */}
                <Dialog>
                    <DialogTrigger>
                        <Button variant={"destructive"}>Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Are you sure absolutely sure?
                            </DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </Fragment>
    )
}

export default ShadCn
