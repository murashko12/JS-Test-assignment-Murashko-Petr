import { useState, useRef, useEffect } from "react"
import { Spin } from 'antd'

interface IProps {
    size?: "default" | "small" | "large"
}

const Loader = ({size = "large"}: IProps) => {

    const [percent, setPercent] = useState(-50)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setPercent((v) => {
                const nextPercent = v + 5
                return nextPercent > 150 ? -50 : nextPercent
            })
        }, 100)
        return () => clearTimeout(timerRef.current!)
    }, [percent])

    return (
        <div className="w-full h-[65vh] flex items-center justify-center">
            <Spin size={size} />
        </div>
    )
}

export default Loader
