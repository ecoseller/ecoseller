import React, { useRef, useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
const OverflowTip = (props: any) => {
    // Create Ref
    const textElementRef = useRef<HTMLInputElement>();

    const compareSize = () => {
        const compare =
            (textElementRef.current != null) ?
                textElementRef.current.scrollWidth > textElementRef.current.clientWidth
                : false;
        console.log('compare: ', compare);
        setHover(compare);
    };

    // compare once and add resize listener on "componentDidMount"
    useEffect(() => {
        compareSize();
        window.addEventListener('resize', compareSize);
    }, []);

    // remove resize listener again on "componentWillUnmount"
    useEffect(() => () => {
        window.removeEventListener('resize', compareSize);
    }, []);

    // Define state and function to update the value
    const [hoverStatus, setHover] = useState(false);

    return (
        <Tooltip
            title={props.value}
            disableHoverListener={!hoverStatus}
            style={{ fontSize: '2em' }}
        >
            <div
                ref={textElementRef}
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {props.someLongText}
            </div>
        </Tooltip>
    );
};

export default OverflowTip;