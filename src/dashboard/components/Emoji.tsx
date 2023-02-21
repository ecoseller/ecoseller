import React from 'react';

interface IEmojiProps {
    label?: string;
    symbol: string;
}

const Emoji = ({ label, symbol }: IEmojiProps) => (
    <span
        className="emoji"
        role="img"
        aria-label={label ? label : ""}
        aria-hidden={label ? "false" : "true"}
    >
        {symbol}
    </span>
);
export default Emoji;