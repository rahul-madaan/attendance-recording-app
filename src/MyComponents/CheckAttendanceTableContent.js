export const CheckAttendanceTableContent = (props) => {

    return (
        <>
            <tr>
                <td>{props.name}</td>
                <td>{props.roll_number}</td>
                <td>{props.net_id}</td>
                <td>PRESENT</td>
            </tr>
        </>
    )
}