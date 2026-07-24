import React from 'react';
import styles from './Title.module.css';

interface TitleProps {
    text: string,
}

const Title = ({text, ...props}: TitleProps) => (
    <span className={styles.title} {...props}>
        {text}
    </span>
);


export default Title;