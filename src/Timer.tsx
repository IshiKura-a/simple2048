import React, {useEffect, useState} from "react";

function Timer() {
    const [timer, incTimer] = useState(0)

    useEffect(() => {
        let timer = setInterval(() => {
            incTimer((time: number) => time + 1)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    })
    return <div className="Timer">Time:{timer}s</div>
}

export default Timer;