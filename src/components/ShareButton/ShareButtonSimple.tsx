import React, { useState } from 'react';

interface ShareButtonProps {
	quote: {
		content: string;
	};
	className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ quote, className }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleShare = async () => {
		setIsLoading(true);
		
		try {
			const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
			const shareText = `"${quote.content}"\n${shareUrl}`;
			
			// Try native sharing first
			if (navigator.share) {
				await navigator.share({
					title: 'Daily Quote',
					text: shareText,
					url: shareUrl
				});
			} else {
				// Fallback: copy to clipboard
				if (navigator.clipboard) {
					await navigator.clipboard.writeText(shareText);
					alert('Quote copied to clipboard!');
				}
			}
		} catch (error) {
			console.error('Share error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const buttonStyle: React.CSSProperties = {
		background: 'linear-gradient(45deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
		border: 'none',
		borderRadius: '50%',
		width: '48px',
		height: '48px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: isLoading ? 'not-allowed' : 'pointer',
		fontSize: '24px',
		opacity: isLoading ? 0.6 : 1,
		transition: 'all 0.2s ease',
		color: 'white'
	};

	const containerStyle: React.CSSProperties = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	};

	return (
		<div style={containerStyle} className={className}>
			<button
				style={buttonStyle}
				onClick={handleShare}
				disabled={isLoading}
				type="button"
				aria-label="Share to Instagram Messages"
			>
				{isLoading ? '⏳' : '💬'}
			</button>
		</div>
	);
};

export { ShareButton };
export type { ShareButtonProps };
