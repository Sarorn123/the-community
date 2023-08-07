type Props = {
    text: string
}

export default function DisplayStringWithLink({ text }: Props) {
    // Regular expression pattern to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g

    // Split the text into parts: non-URL text and URLs
    const parts = text.split(urlRegex)
    return (
        <pre className="py-3 overflow-auto">
            {parts.map((part, index) => {
                const isUrl = part.match(urlRegex)

                if (isUrl) {
                    return (
                        <a
                            target="_blank"
                            key={index}
                            href={part}
                            className="text-blue-600 hover:underline"
                        >
                            {part}
                        </a>
                    )
                } else {
                    return <span key={index}>{part}</span>
                }
            })}
        </pre>
    )
}
