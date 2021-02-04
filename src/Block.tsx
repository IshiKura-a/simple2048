import './Block.css'

function Block(props: any) {
    let {value} = props
    let index: number;
    if(value === 0) {
        index = 0
        value = null
    }
    else index = Math.log2(value)

    const colorMap: string[] = ["#D3C1B3", "#E7DBCF", "#E7D1BA", "#E79A65",
        "#E3754C", "#ED5E5A", "#D54C3C", "#EDCE71",
        "#F1D04B", "#E4C843", "#E5C140", "#E6C02F",
        "#AF83AD", "#AE71A1", "#9F54A4", "#6B76B5",
        "#6665CD"]


    return (
        <div className="Block" style={{
            background: `${colorMap[index]}`, width: "80px", height: "80px", margin: "10px",
            alignContent: "center"
        }}>
            <div className="Value">{value}</div>
        </div>
    )
}

export default Block;