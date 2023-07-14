import Header from "./_components/Header"

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <Header />
            {children}
        </section>
    )
}
