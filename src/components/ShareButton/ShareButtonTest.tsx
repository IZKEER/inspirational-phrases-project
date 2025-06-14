import React, { useState } from 'react';

interface ShareButtonProps {
	quote: {
		content: string;
	};
	className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ quote, className }) => {
	const [clicked, setClicked] = useState(false);

	const handleClick = () => {
		console.log('BUTTON CLICKED!');
		alert('Button clicked! Quote: ' + quote.content);
		setClicked(true);
		
		// Reset after 2 seconds
		setTimeout(() => setClicked(false), 2000);
	};

	const buttonStyle: React.CSSProperties = {
		background: clicked ? 'green' : 'linear-gradient(45deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
		border: 'none',
		borderRadius: '50%',
		width: '48px',
		height: '48px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		fontSize: '24px',
		color: 'white',
		margin: '10px'
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }} className={className}>
			<button
				style={buttonStyle}
				onClick={handleClick}
				type="button"
			>
				{clicked ? '✅' : '💬'}
			</button>
		</div>
	);
};

export { ShareButton };
export type { ShareButtonProps };
