import React from 'react';
import './ProgressBar.css'; // Assuming you will create a CSS file for styling

interface ProgressBarProps {
    progress: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;
