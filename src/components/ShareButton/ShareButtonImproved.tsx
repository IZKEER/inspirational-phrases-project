import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { generateQuoteImage } from '@/lib/quoteImageGenerator';
import styles from './ShareButton.module.scss';

const cx = classNames.bind(styles);

interface ShareButtonProps {
	quote: {
		content: string;
	};
	className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ quote, className }) => {
	const [isGeneratingImage, setIsGeneratingImage] = useState(false);
	const [showCopyText, setShowCopyText] = useState(false);

	// Create shareable text (without author, with URL)
	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareText = `"${quote.content}"\n${shareUrl}`;

	const handleInstagramMessages = async () => {
		console.log('Share button clicked!');
		setIsGeneratingImage(true);
		
		try {
			const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			const isHTTPS = window.location.protocol === 'https:';
			
			console.log('Is mobile:', isMobile, 'Is HTTPS:', isHTTPS);
			
			if (isMobile && isHTTPS) {
				// Only try advanced sharing on HTTPS mobile
				console.log('HTTPS Mobile - trying Web Share API...');
				
				if (navigator.share) {
					try {
						await navigator.share({
							title: 'Daily Quote',
							text: shareText,
							url: shareUrl
						});
						console.log('Share successful!');
						return;
					} catch (shareError) {
						console.log('Share was cancelled or failed:', shareError);
						// Don't show error for cancellation
						if (shareError.name !== 'AbortError') {
							console.error('Share error:', shareError);
						}
					}
				}
			}
			
			// For local development or when advanced sharing fails
			// Show a nice text selection interface
			setShowCopyText(true);
			
		} catch (error) {
			console.error('Share process failed:', error);
			setShowCopyText(true);
		} finally {
			setIsGeneratingImage(false);
		}
	};

	const handleCopyToClipboard = async () => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(shareText);
				alert('Copied to clipboard! 📋');
				setShowCopyText(false);
			} else {
				// Fallback: select the text
				const textArea = document.getElementById('quote-text-area') as HTMLTextAreaElement;
				if (textArea) {
					textArea.select();
					textArea.setSelectionRange(0, 99999); // For mobile devices
					document.execCommand('copy');
					alert('Copied to clipboard! 📋');
					setShowCopyText(false);
				}
			}
		} catch (error) {
			console.error('Copy failed:', error);
			alert('Please manually copy the text above');
		}
	};

	const handleCloseCopyInterface = () => {
		setShowCopyText(false);
	};

	if (showCopyText) {
		return (
			<div className={cx('share-container', className)}>
				<div style={{
					background: 'rgba(0, 0, 0, 0.9)',
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1000,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '20px'
				}}>
					<div style={{
						background: 'white',
						borderRadius: '12px',
						padding: '24px',
						maxWidth: '400px',
						width: '100%',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
					}}>
						<h3 style={{ 
							margin: '0 0 16px 0', 
							color: '#333',
							textAlign: 'center',
							fontSize: '18px'
						}}>
							Copy to Share 📋
						</h3>
						
						<textarea
							id="quote-text-area"
							value={shareText}
							readOnly
							style={{
								width: '100%',
								height: '120px',
								padding: '12px',
								border: '2px solid #e0e0e0',
								borderRadius: '8px',
								fontSize: '14px',
								fontFamily: 'inherit',
								resize: 'none',
								marginBottom: '16px',
								boxSizing: 'border-box'
							}}
						/>
						
						<div style={{ 
							display: 'flex', 
							gap: '12px',
							justifyContent: 'center'
						}}>
							<button
								onClick={handleCopyToClipboard}
								style={{
									background: 'linear-gradient(45deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
									color: 'white',
									border: 'none',
									borderRadius: '8px',
									padding: '12px 24px',
									cursor: 'pointer',
									fontSize: '14px',
									fontWeight: '500'
								}}
							>
								Copy Text
							</button>
							
							<button
								onClick={handleCloseCopyInterface}
								style={{
									background: '#f0f0f0',
									color: '#333',
									border: 'none',
									borderRadius: '8px',
									padding: '12px 24px',
									cursor: 'pointer',
									fontSize: '14px'
								}}
							>
								Close
							</button>
						</div>
						
						<p style={{
							fontSize: '12px',
							color: '#666',
							textAlign: 'center',
							margin: '12px 0 0 0'
						}}>
							Paste this in Instagram messages! 💬
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cx('share-container', className)}>
			<div className={cx('social-buttons')}>
				<button
					className={cx('social-button', 'instagram-messages-button')}
					onClick={handleInstagramMessages}
					disabled={isGeneratingImage}
					type="button"
					aria-label="Share to Instagram Messages"
				>
					{isGeneratingImage ? (
						<span style={{ fontSize: '20px' }}>⏳</span>
					) : (
						<div className={cx('instagram-icon')}>💬</div>
					)}
				</button>
			</div>
		</div>
	);
};

export { ShareButton };
export type { ShareButtonProps };
