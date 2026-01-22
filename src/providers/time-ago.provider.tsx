import { createContext, useContext, useEffect, useState } from 'react'

const TimeContext = createContext<number>(Date.now())

export const TimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now())
        }, 60_000)

        return () => clearInterval(timer)
    }, [])

    return (
        <TimeContext.Provider value={now}>
            {children}
        </TimeContext.Provider>
    )
}

export const useNow = () => useContext(TimeContext)
