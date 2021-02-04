import React, {useEffect, useState} from 'react';
import './App.css';
import Block from "./Block";

function App() {
    type Data = number[]
    type History = Data[]
    type PosFunc = (i: number, j: number) => number
    type Validity = (prevIndex: number, curIndex: number) => boolean

    const [time, incTimer] = useState(0)
    const [data, updateData] = useState(
        [2, 2, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0] as Data)

    function getScore(): number {
        return data.reduce((accumulator, currentValue) => accumulator + currentValue)
    }



    useEffect(() => {
        window.addEventListener("keypress", (e: any) => {
            console.log(e.key)
            let newState: Data = data.concat()

            function randomNewNumber(): Data {
                let zeros = newState.map((v, idx) => {
                    if (v === 0) {
                        return idx
                    } else return 0
                }).filter(v => v !== 0)
                newState[zeros.reduce((accumulator, currentValue) => {
                    if (Math.random() >= 1 / zeros.length) {
                        return accumulator
                    } else return currentValue
                }, zeros[0])] = 2
                console.log("newState", newState)
                return newState
            }

            function merge(prevPos: PosFunc, curPos: PosFunc, isValid: Validity) {
                for (let i = 0; i < 4; i++) {
                    let flag = true
                    while (flag) {
                        flag = false
                        for (let j = 0; j < 4; j++) {
                            const prevIndex = prevPos(i, j)
                            const curIndex = curPos(i, j)
                            if (!isValid(prevIndex, curIndex) || newState[curIndex] === 0)
                                continue
                            if (newState[prevIndex] === 0) {
                                flag = true
                                newState[prevIndex] = newState[curIndex]
                                newState[curIndex] = 0
                            } else if (newState[prevIndex] === newState[curIndex]) {
                                flag = true
                                newState[prevIndex] *= 2
                                newState[curIndex] = 0
                            }
                        }
                    }
                }
            }

            if (e.key === "w") {
                merge((i, j) => 4 * j + i - 4,
                    (i, j) => 4 * j + i,
                    (prevIndex, curIndex) => prevIndex >= 0)
                updateData(randomNewNumber())
            } else if (e.key === "a") {
                merge((i, j) => 4 * i + j - 1,
                    (i, j) => 4 * i + j,
                    (prevIndex, curIndex) =>
                        Math.floor(prevIndex / 4) === Math.floor(curIndex / 4))
                updateData(randomNewNumber())
            } else if (e.key === "s") {
                merge((i, j) => 16 - 4 * j + i,
                    (i, j) => 12 - 4 * j + i,
                    (prevIndex, curIndex) => curIndex < 16)
                updateData(randomNewNumber())
            } else if (e.key === "d") {
                merge((i, j) => 4 * i + 4 - j,
                    (i, j) => 4 * i + 3 - j,
                    (prevIndex, curIndex) =>
                        Math.floor(prevIndex / 4) === Math.floor(curIndex / 4))
                updateData(randomNewNumber())
            } else if (e.key === "u") {
                console.log(data)
            }
        })

        let timer = setInterval(() => {
            incTimer((time: number) => time + 1)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    let tmp = data.map((v, index) => <td key={index}><Block value={v}/></td>)
    return (
        <div className="App" onKeyDown={e => alert(e.key)}>
            <h2>Simple 2048 Project</h2>
            <div className="Timer">Time:{time}s</div>
            <div className="Score">Score:{getScore()}</div>
            <table className="Game">
                <tr>{tmp.filter((v, index) => index >= 0 && index < 4)}</tr>
                <tr>{tmp.filter((v, index) => index >= 4 && index < 8)}</tr>
                <tr>{tmp.filter((v, index) => index >= 8 && index < 12)}</tr>
                <tr>{tmp.filter((v, index) => index >= 12 && index < 16)}</tr>
            </table>

        </div>
    );
}

export default App;
