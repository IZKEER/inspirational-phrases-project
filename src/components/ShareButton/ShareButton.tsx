import React, {useState} from 'react';
import {Loader2} from 'lucide-react';
import classNames from 'classnames/bind';

import {generateQuoteImage} from '@/lib/quoteImageGenerator';
import styles from './ShareButton.module.scss';

const cx = classNames.bind(styles);

interface ShareButtonProps {
	quote: {
		content: string;
	};
	className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({quote, className}) => {
	const [isGeneratingImage, setIsGeneratingImage] = useState(false);

	// Create shareable text (without author, with URL)
	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareText = `"${quote.content}"\n${shareUrl}`;

	// Handle Instagram Messages specifically
	const handleInstagramMessages = async () => {
		console.log('Share button clicked!'); // Debug log
		setIsGeneratingImage(true);

		try {
			console.log('Generating image...'); // Debug log
			const imageBlob = await generateQuoteImage(quote, {
				width: 1080,
				height: 1080,
				padding: 100,
			});
			console.log('Image generated successfully'); // Debug log

			// For mobile devices, try Instagram URL scheme first
			const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			);
			console.log('Is mobile:', isMobile); // Debug log

			if (isMobile) {
				// Try to open Instagram directly to messages
				try {
					console.log('Trying mobile sharing...'); // Debug log

					// Check if native sharing is available
					if (navigator.share && navigator.canShare) {
						const file = new File([imageBlob], 'quote.png', {type: 'image/png'});
						if (navigator.canShare({files: [file]})) {
							console.log('Using native share...'); // Debug log
							await navigator.share({
								title: 'Share to Instagram Messages',
								text: shareText,
								files: [file],
							});
							console.log('Share completed successfully'); // Debug log
							return;
						}
					}

					// Fallback: copy to clipboard and try URL scheme
					console.log('Fallback: copying to clipboard...'); // Debug log
					if (navigator.clipboard && navigator.clipboard.write) {
						await navigator.clipboard.write([new ClipboardItem({'image/png': imageBlob})]);
						console.log('Image copied to clipboard'); // Debug log
					}

					// Try Instagram URL scheme
					console.log('Trying Instagram URL scheme...'); // Debug log
					window.location.href = 'instagram://direct-messages';
				} catch (urlError) {
					console.error('Mobile sharing error:', urlError);

					// Final fallback: simple text sharing
					if (navigator.share) {
						console.log('Trying simple text share...'); // Debug log
						try {
							await navigator.share({
								title: 'Daily Quote',
								text: shareText,
							});
						} catch (shareError) {
							console.error('Simple share also failed:', shareError);
						}
					}
				}
			} else {
				// Desktop: Copy to clipboard and show instructions
				console.log('Desktop: copying to clipboard...'); // Debug log
				if (navigator.clipboard && navigator.clipboard.write) {
					await navigator.clipboard.write([new ClipboardItem({'image/png': imageBlob})]);
					console.log('Image copied! Open Instagram on your phone and paste in messages.');
					alert('Image copied! Open Instagram on your phone and paste in messages.');
				}
			}
		} catch (error) {
			console.error('Instagram messages error:', error);
			alert('Error: ' + error.message); // Show error to user
		} finally {
			setIsGeneratingImage(false);
			console.log('Share process completed'); // Debug log
		}
	};

	return (
		<div className={cx('share-container', className)}>
			<div className={cx('social-buttons')}>
				{/* Instagram Messages Button */}
				<button
					className={cx('social-button', 'instagram-messages-button')}
					onClick={handleInstagramMessages}
					disabled={isGeneratingImage}
					type="button"
					aria-label="Share to Instagram Messages">
					{isGeneratingImage ? (
						<Loader2 className={cx('loading-icon')} size={20} />
					) : (
						<div className={cx('instagram-icon')}>💬</div>
					)}
				</button>
			</div>
		</div>
	);
};

export {ShareButton};
export type {ShareButtonProps};
