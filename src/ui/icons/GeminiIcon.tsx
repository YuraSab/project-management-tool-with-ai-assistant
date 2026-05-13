import React from 'react';
import geminiLogo from '../../assets/gemini-icon.svg'; // Імпортуємо як змінну

interface GeminiIconProps {

    size?: number,
}

const GeminiIcon = ({ size = 36 }: GeminiIconProps) => {
    return (
        <img
            src={`${geminiLogo}`}
            alt="Gemini Logo"
            style={{width: size, height: size}}
        />
    );
};

export default GeminiIcon;