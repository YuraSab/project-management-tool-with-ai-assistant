import React from "react";
import geminiLogo from '../../assets/gemini-icon.svg';

interface GeminiIconProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>{
    size?: number,
}

const GeminiIcon = ({ size = 36, style, ...props }: GeminiIconProps) => {
    return (
        <img
            src={`${geminiLogo}`}
            alt={"Gemini Logo"}
            style={{ width: size, height: size, ...style }}
            {...props}
        />
    );
};

export default GeminiIcon;