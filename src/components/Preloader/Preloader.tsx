import React, {useState, useEffect} from 'react';
import {SectionContainer} from '../SectionContainer';
import styles from './Preloader.module.scss';
import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

interface SimplePreloaderProps {
	onFinish: () => void;
	text?: string;
}

const Preloader: React.FC<SimplePreloaderProps> = ({onFinish, text = 'Nobody cares, work harder'}) => {
	const [fadeOut, setFadeOut] = useState(false);
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
				setFadeOut(true);

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
				<div className={cx('preloader', {fadeOut})}>
					<div className={cx('text')}>
						{displayText}
						<span className={cx('cursor')} />
					</div>
				</div>
			</SectionContainer>
		</>
	);
};

export {Preloader};
