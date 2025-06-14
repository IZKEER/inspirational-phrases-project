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
		console.log('Share button clicked - TEXT ONLY VERSION');
		setIsLoading(true);
		
		try {
			const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
			const shareText = `"${quote.content}"\n${shareUrl}`;
			
			console.log('Share text:', shareText);
			console.log('Navigator.share available:', !!navigator.share);
			
			// Try simple text sharing first
			if (navigator.share) {
				console.log('Attempting to share...');
				await navigator.share({
					title: 'Daily Quote',
					text: shareText,
					url: shareUrl
				});
				console.log('Share successful!');
			} else {
				console.log('Navigator.share not available, trying clipboard...');
				if (navigator.clipboard) {
					await navigator.clipboard.writeText(shareText);
					alert('Quote copied to clipboard!');
					console.log('Copied to clipboard successfully');
				} else {
					console.log('Clipboard API also not available');
					alert('Sharing not supported on this device');
				}
			}
		} catch (error) {
			console.error('Share error:', error);
			if (error.name === 'AbortError') {
				console.log('User cancelled the share');
			} else {
				alert('Error sharing: ' + error.message);
			}
		} finally {
			setIsLoading(false);
			console.log('Share process completed');
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

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }} className={className}>
			<button
				style={buttonStyle}
				onClick={handleShare}
				disabled={isLoading}
				type="button"
				aria-label="Share quote"
			>
				{isLoading ? '⏳' : '💬'}
			</button>
		</div>
	);
};

export { ShareButton };
export type { ShareButtonProps };
