"use client"

import React from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import PolicyCard from "./PolicyCard"

const PolicyAndCommunity = () => {
    return (
        <section className=" w-[25%]  hidden md:block">
            <div className="">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Popular Community</AccordionTrigger>
                        <AccordionContent>
                            <a
                                href="https://www.youtube.com/@rorntech7994/videos"
                                target="_blank"
                                className="hover:underline text-blue-600"
                            >
                                Follow Us 👉❤
                            </a>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Coding</AccordionTrigger>
                        <AccordionContent>
                            Dont forget to support community 🙏❤
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="sticky top-[5rem]">
                <PolicyCard />
            </div>
        </section>
    )
}

export default PolicyAndCommunity
