import StatusText, { StatusType } from "../statusText/StatusText";

interface CheckBoxStatusProps<T extends StatusType> {
    status: T,
    setStatusFilter: (value: T) => void,
    checked?: boolean,
}

const CheckBoxStatus = <T extends StatusType,>(
    { status, setStatusFilter, checked }: CheckBoxStatusProps<T>
) => (
    <div>
        <input
            type={"checkbox"}
            checked={checked ?? false}
            name={"status"}
            value={status}
            style={{ marginRight: 4, cursor: 'pointer' }}
            onChange={() => setStatusFilter(status)}
        />
        <StatusText status={status as StatusType}/>
    </div>
);

export default CheckBoxStatus;