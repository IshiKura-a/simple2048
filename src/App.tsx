import React, {useEffect, useState} from 'react';
import './App.css';
import Block from "./Block";
import Timer from "./Timer";

function App() {
    type Data = number[]
    type History = Data[]
    type PosFunc = (i: number, j: number) => number
    type Validity = (prevIndex: number, curIndex: number) => boolean

    interface MergeFunc {
        prevPos: PosFunc,
        curPos: PosFunc,
        isValid: Validity
    }

    const [history, setHistory] = useState([
        [2, 2, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0]
    ] as History)
    const [table, setTable] = useState(
        getTableElement(history[0])
    )


    function getScore(): number {
        return history[0].reduce((accumulator, currentValue) => accumulator + currentValue)
    }


    useEffect(() => {
        const mergeFuncList: { [key: string]: MergeFunc } = {
            "w": {
                prevPos: (i, j) => 4 * j + i - 4,
                curPos: (i, j) => 4 * j + i,
                isValid: (prevIndex, curIndex) => prevIndex >= 0
            },
            "a": {
                prevPos: (i, j) => 4 * i + j - 1,
                curPos: (i, j) => 4 * i + j,
                isValid: (prevIndex, curIndex) => Math.floor(prevIndex / 4) === Math.floor(curIndex / 4)
            },
            "s": {
                prevPos: (i, j) => 16 - 4 * j + i,
                curPos: (i, j) => 12 - 4 * j + i,
                isValid: (prevIndex, curIndex) => curIndex < 16
            },
            "d": {
                prevPos: (i, j) => 4 * i + 4 - j,
                curPos: (i, j) => 4 * i + 3 - j,
                isValid: (prevIndex, curIndex) => Math.floor(prevIndex / 4) === Math.floor(curIndex / 4)
            }
        }

        function randomNewNumber(state: Data): Data {
            let zeros = state.map((v, idx) => v === 0 ? idx : 0).filter(v => v !== 0)
            state[zeros.reduce((accumulator, currentValue) =>
                Math.random() >= 1 / zeros.length ? accumulator : currentValue, zeros[0])] = 2
            return state
        }

        function merge(state: Data, prevPos: PosFunc, curPos: PosFunc, isValid: Validity): Data {
            for (let i = 0; i < 4; i++) {
                let flag = true
                while (flag) {
                    flag = false
                    for (let j = 0; j < 4; j++) {
                        const prevIndex = prevPos(i, j)
                        const curIndex = curPos(i, j)
                        if (!isValid(prevIndex, curIndex) || state[curIndex] === 0)
                            continue
                        if (state[prevIndex] === 0) {
                            flag = true
                            state[prevIndex] = state[curIndex]
                            state[curIndex] = 0
                        } else if (state[prevIndex] === state[curIndex]) {
                            flag = true
                            state[prevIndex] *= 2
                            state[curIndex] = 0
                        }
                    }
                }
            }
            return state
        }

        function onKeyPress(e: KeyboardEvent) {
            if (["w", "a", "s", "d"].includes(e.key)) {
                console.log(e.key)
                const func = mergeFuncList[e.key]
                setHistory(prev =>
                    [randomNewNumber(merge(prev[0].concat(), func.prevPos, func.curPos, func.isValid)), ...prev]
                )
            } else if (e.key === "u") {
                setHistory(prev => {
                    console.log("Reverting", prev)
                    return prev.length > 1 ? [...prev.slice(1)] : prev
                })
            }
        }

        window.addEventListener("keypress", onKeyPress)

        return () => window.removeEventListener("keypress", onKeyPress)
    }, [])

    useEffect(
        () => {
            setTable(prev => getTableElement(history[0]))
        }, [history]
    )

    function getLineElement(raw: Data, beginIndex: number, endIndex: number) {
        return raw.map((v, index) => <td key={index}><Block value={v}/></td>)
            .filter((v, index) => index >= beginIndex && index < endIndex)
    }

    function getTableElement(raw: Data) {
        return <tbody>
        <tr>{getLineElement(raw, 0, 4)}</tr>
        <tr>{getLineElement(raw, 4, 8)}</tr>
        <tr>{getLineElement(raw, 8, 12)}</tr>
        <tr>{getLineElement(raw, 12, 16)}</tr>
        </tbody>
    }

    return (
        <div className="App">
            <h2>Simple 2048 Project</h2>
            <Timer/>
            <div className="Score">Score:{getScore()}</div>
            <table className="Game">
                {table}
            </table>
        </div>
    );
}

export default App;
