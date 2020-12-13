export const textMarker = (text, val) => {
    const index = text.toLowerCase().indexOf(val.toLowerCase())
    const middle = index + val.length
    const end = text.length

    return (
        <>
            {index === -1
                ? <span>{text}</span>
                : <span>
                    {text.slice(0,index)}
                    <span style={{backgroundColor: "yellow"}}>{text.slice(index, middle)}</span>
                    {text.slice(middle, end)}
                </span>
            }
        </>
    )
}