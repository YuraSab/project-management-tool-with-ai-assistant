import React from 'react';
import styles from './Title.module.css';

interface TitleProps {
    text: string,
}

const Title = ({text}: TitleProps) => (
    <span className={styles.title}>
        {text}
    </span>
);


export default Title;