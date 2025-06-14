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

	// Create shareable text (without author, with URL)
	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareText = `"${quote.content}"\n${shareUrl}`;

	const handleInstagramMessages = async () => {
		console.log('Share button clicked!');
		setIsGeneratingImage(true);
		
		try {
			const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			console.log('Is mobile:', isMobile);
			
			if (isMobile) {
				// Mobile: Try multiple approaches in order of preference
				console.log('Mobile detected - trying Web Share API first...');
				
				// Approach 1: Try Web Share API with text only (most reliable on mobile)
				if (navigator.share) {
					try {
						console.log('Trying text share...');
						await navigator.share({
							title: 'Daily Quote',
							text: shareText,
							url: shareUrl
						});
						console.log('Text share successful!');
						return; // Success, exit early
					} catch (shareError) {
						console.log('Text share failed:', shareError);
						// Continue to next approach
					}
				}
				
				// Approach 2: Try generating image and using Web Share API with file
				try {
					console.log('Trying image generation for mobile...');
					const imageBlob = await generateQuoteImage(quote, {
						width: 1080,
						height: 1080,
						padding: 100
					});
					console.log('Image generated for mobile');
					
					if (navigator.share && navigator.canShare) {
						const file = new File([imageBlob], 'quote.png', { type: 'image/png' });
						if (navigator.canShare({ files: [file] })) {
							console.log('Trying file share...');
							await navigator.share({
								title: 'Daily Quote',
								files: [file]
							});
							console.log('File share successful!');
							return;
						}
					}
				} catch (imageError) {
					console.error('Image generation/sharing failed on mobile:', imageError);
				}
				
				// Approach 3: Try clipboard with text (fallback)
				if (navigator.clipboard && navigator.clipboard.writeText) {
					try {
						console.log('Trying clipboard text...');
						await navigator.clipboard.writeText(shareText);
						alert('Quote copied to clipboard! 📋');
						console.log('Text copied to clipboard');
						return;
					} catch (clipError) {
						console.error('Clipboard failed:', clipError);
					}
				}
				
				// Approach 4: Last resort - show text for manual copy
				alert('Here\'s your quote to copy:\n\n' + shareText);
				
			} else {
				// Desktop: Generate image and copy to clipboard
				console.log('Desktop detected - generating image...');
				try {
					const imageBlob = await generateQuoteImage(quote, {
						width: 1080,
						height: 1080,
						padding: 100
					});
					console.log('Image generated for desktop');
					
					if (navigator.clipboard && navigator.clipboard.write) {
						await navigator.clipboard.write([
							new ClipboardItem({ 
								'image/png': imageBlob,
								'text/plain': new Blob([shareText], { type: 'text/plain' })
							})
						]);
						alert('Image and text copied to clipboard! 📋\nPaste in Instagram messages.');
						console.log('Image copied to clipboard on desktop');
					}
				} catch (error) {
					console.error('Desktop image generation failed:', error);
					// Fallback to text only
					if (navigator.clipboard && navigator.clipboard.writeText) {
						await navigator.clipboard.writeText(shareText);
						alert('Quote copied to clipboard! 📋');
					}
				}
			}
			
		} catch (error) {
			console.error('Share process failed:', error);
			alert('Unable to share. Error: ' + error.message);
		} finally {
			setIsGeneratingImage(false);
			console.log('Share process completed');
		}
	};

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
