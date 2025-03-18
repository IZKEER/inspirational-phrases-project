import React, {useState, useEffect} from 'react';
import {SectionContainer} from '../SectionContainer';

interface SimplePreloaderProps {
	onFinish: () => void;
	text?: string;
}

const Preloader: React.FC<SimplePreloaderProps> = ({onFinish, text = 'Nobody cares, work harder'}) => {
	const [opacity, setOpacity] = useState(1);
	const [displayText, setDisplayText] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);

	// Typing effect
	useEffect(() => {
		if (currentIndex < text.length) {
			const typingTimer = setTimeout(() => {
				setDisplayText((prev) => prev + text[currentIndex]);
				setCurrentIndex((prevIndex) => prevIndex + 1);
			}, 100); // Adjust speed of typing here

			return () => clearTimeout(typingTimer);
		}
	}, [currentIndex, text]);

	// Fade out effect after typing is done
	useEffect(() => {
		if (currentIndex === text.length) {
			// Add a slight delay after typing completes before fading out
			const fadeTimer = setTimeout(() => {
				// Start fade out
				setOpacity(0);

				// Call onFinish when animation completes
				setTimeout(() => {
					onFinish();
				}, 1000);
			}, 800);

			return () => clearTimeout(fadeTimer);
		}
	}, [currentIndex, text, onFinish]);

	return (
		<>
			<SectionContainer size="fluid">
				<div
					style={{
						position: 'fixed',
						top: 0,
						padding: 80,
						left: 0,
						width: '100%',
						height: '100%',
						fontFamily: 'Posterama',
						display: 'flex',
						lineHeight: 1.5,
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						background: 'linear-gradient(5deg, rgb(2, 0, 40) 0%, rgb(21, 0, 35) 100%);',
						opacity: opacity,
						transition: 'opacity 1s ease',
						zIndex: 9999,
					}}>
					<div
						style={{
							fontSize: '1.5rem',
							fontWeight: 300,
							color: '#adb8cc',
							opacity: 0.8,
							height: '2rem',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{displayText}
					</div>

					<style jsx>{`
						@keyframes blink-caret {
							from,
							to {
								border-color: transparent;
							}
							50% {
								border-color: #333;
							}
						}
					`}</style>
				</div>
			</SectionContainer>
		</>
	);
};

export {Preloader};
