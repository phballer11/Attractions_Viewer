import React, { useState, useRef, useEffect } from 'react';

const Star: React.FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2.5L14.09 8.26L20.5 8.74L15.82 12.93L17.45 19.24L12 15.77L6.55 19.24L8.18 12.93L3.5 8.74L9.91 8.26L12 2.5Z"
                fill="#ffd700"
            />
        </svg>
    );
};

export default Star;
