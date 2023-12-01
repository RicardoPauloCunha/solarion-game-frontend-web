import Navbar from "../Navbar"

interface PageContainerProps {
    children: React.ReactNode
}

const PageContainer = ({
    children
}: PageContainerProps) => {
    return (
        <>
            <Navbar />

            {children}
        </>
    )
}

export default PageContainer