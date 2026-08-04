import React, { HTMLAttributes } from 'react';
import { Ban, GlobeOff, LucideProps, SearchAlert, ServerCrash } from 'lucide-react';
import { HighlightColor } from "../../types/user";
import { getColor } from "../../utils/colorThemeSelector";
import { useProfileStore } from "../../store/profileStore";
import styles from './Error.module.css';

type ErrorType = 'not_found' | 'server_crash' | 'no_access' | 'network_problems';

interface ErrorConfig {
    Icon: React.ComponentType<LucideProps>,
    defaultText: string,
}

const ERROR_OPTIONS: Record<ErrorType, ErrorConfig> = {
    not_found: {
        Icon: SearchAlert,
        defaultText: 'Nothing found!',
    },
    server_crash: {
        Icon: ServerCrash,
        defaultText: 'Something went wrong!',
    },
    no_access: {
        Icon: Ban,
        defaultText: 'You have no access to this project!',
    },
    network_problems: {
        Icon: GlobeOff,
        defaultText: 'Network problems!',
    }
};

interface ErrorProps extends HTMLAttributes<HTMLDivElement>{
    type: ErrorType,
    text?: string,
}

const Error = ({ type, text, style, ...rest }: ErrorProps) => {
    const highlightColor = useProfileStore((state) => state.profile?.highlightColor)
    const { Icon, defaultText } = ERROR_OPTIONS[type];
    const color = getColor(highlightColor ?? HighlightColor.Purple);
    return (
        <div
            className={styles.block}
            style={{ color: color, ...style }}
            {...rest}
        >
            <h2>{text ? text : defaultText}</h2>
            <Icon size={54} color={color}/>
        </div>
    );
};

export default Error;