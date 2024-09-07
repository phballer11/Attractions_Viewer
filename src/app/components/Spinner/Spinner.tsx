import React from 'react';
import './Spinner.css'; // Assuming you will create a CSS file for styling

const Spinner = () => {
    return (
        <div className="loading-container">
            <svg className="spinner" width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle
                    className="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                    strokeDasharray="90,150"
                    stroke="#ffcc00"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default Spinner;
