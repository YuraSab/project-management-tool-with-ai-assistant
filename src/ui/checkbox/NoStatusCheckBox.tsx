import React from "react";
import NoStatusText from "../noStatusText/NoStatusText.tsx";

interface CheckBoxStatusProps extends Omit<React.CustomComponentPropsWithRef<'input'>, 'onChange'> {
    text: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    name?: string,
    customStyles?: React.CSSProperties,
}

const NoStatusCheckBox = ({ text, checked, onChange, customStyles, name = "status checkbox", ...props }: CheckBoxStatusProps) => {
    return(
        <div>
            <input
                type={"checkbox"}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                name={name}
                style={{ marginRight: 4, ...customStyles }}
                {...props}
            />
            <NoStatusText text={text}/>
        </div>
    )
}

export default NoStatusCheckBox;