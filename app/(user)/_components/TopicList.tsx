import Link from "next/link"
import React, { Fragment } from "react"
import { topic_data } from "@/db/static_data"
import { TopicType } from "@/types/Static_data_type"

const TopicList = () => {
    return (
        <Fragment>
            <div className="mt-5">
                {topic_data.map((topic: TopicType, index: number) => (
                    <div
                        className="py-2 hover:translate-x-2 transition-all border-l pl-5 hover:border-blue-600"
                        key={index}
                    >
                        <Link href={"/?search=" + topic.params}>
                            <p>{topic.title}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </Fragment>
    )
}

export default TopicList
