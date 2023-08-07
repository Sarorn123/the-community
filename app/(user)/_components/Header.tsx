"use client"

import { Button } from "@/components/ui/button"
import { Search, MoreVertical } from "lucide-react"
import React, { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Mode from "./Mode"
import { signOut, useSession } from "next-auth/react"
import SignInForm from "./SignInForm"
import { Skeleton } from "@/components/ui/skeleton"
import TopicList from "./TopicList"
import PolicyCard from "./PolicyCard"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const Header = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [keyword, setKeyword] = useState<string>("")
    const [openSearch, setOpenSearch] = useState<boolean>(false)

    function search(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!keyword) return
        if (e.keyCode === 13) {
            router.push("/?search=" + keyword)
            setKeyword("")
            setOpenSearch(false)
        }
    }

    return (
        <div className="backdrop-blur-3xl sticky top-0  border-b z-50">
            <div className="flex justify-between items-center  py-3 px-10 container ">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <h1 className="font-bold lg:text-lg">
                            Community <span className="text-[10px] ">beta</span>{" "}
                        </h1>
                    </Link>

                    <div className="lg:hidden">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost">
                                    <MoreVertical size={20} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>More</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="topic" className="w-full">
                                    <TabsList className="w-full">
                                        <TabsTrigger value="topic">
                                            Topic
                                        </TabsTrigger>
                                        <TabsTrigger value="policy">
                                            Policy
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="topic">
                                        <TopicList />
                                    </TabsContent>
                                    <TabsContent value="policy">
                                        <PolicyCard />
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Dialog open={openSearch} onOpenChange={setOpenSearch}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Search
                                    size={20}
                                    className="rotate-90 transition-all"
                                />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Search</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder="Write something and hit enter"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={search}
                            />
                        </DialogContent>
                    </Dialog>

                    <Mode />

                    {status === "loading" ? (
                        <Skeleton className="h-10 w-10 rounded-full" />
                    ) : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Image
                                    className="rounded-full object-cover w-10 h-10 cursor-pointer"
                                    src={session.user.image || ""}
                                    alt={session.user.name || "Avatar"}
                                    width={50}
                                    height={50}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex flex-col">
                                    <p>{session.user.name}</p>
                                    <p>{session.user.email}</p>
                                </DropdownMenuItem>
                                <Button
                                    variant="destructive"
                                    onClick={() => signOut()}
                                    className="mt-3 w-full"
                                >
                                    Sign Out
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <SignInForm openText="Sign In" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header
