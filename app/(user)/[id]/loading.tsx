"use client"

import { Loader2 } from "lucide-react"
import React from "react"

const Loading = () => {
    return (
        <div className="container flex justify-center ">
            <Loader2 className="animate-spin mt-20" size={40} />
        </div>
    )
}

export default Loading
