import React from "react";
import NoStatusText from "../noStatusText/NoStatusText.tsx";

interface CheckBoxStatusProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    text: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    name?: string,
}

const NoStatusCheckBox = (
    { text, checked, onChange, style, name = "status checkbox", ...props }: CheckBoxStatusProps
) => (
    <div style={{ marginTop: 4 }}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            name={name}
            style={{ marginRight: 4, ...style}}
            {...props}
        />
        <NoStatusText text={text}/>
    </div>
);

export default NoStatusCheckBox;