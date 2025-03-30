import React, {HTMLAttributes, useEffect, useState} from 'react';
import classNames from 'classnames/bind';

import styles from './QuoteCard.module.scss';
import {Brain3d} from '../Brain3d';

let cx = classNames.bind(styles);

type QuoteCardProps = {
	title?: string;
	initialContent?: string;
	initialAuthor?: string;
	imageSrc?: string;
	className?: string;
} & HTMLAttributes<HTMLDivElement>;

const QuoteCard = ({title, initialContent, initialAuthor, imageSrc, className}: QuoteCardProps) => {
	// State to store the quote data
	const [quoteContent, setQuoteContent] = useState(initialContent || '');
	const [quoteAuthor, setQuoteAuthor] = useState(initialAuthor || '');
	const [isLoading, setIsLoading] = useState(true);
	const [countdown, setCountdown] = useState('');

	// Function to get today's date as a string (YYYY-MM-DD)
	const getTodayString = () => {
		const today = new Date();
		return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
			today.getDate()
		).padStart(2, '0')}`;
	};

	// Function to generate a deterministic number from a string
	const generateSeed = (str: string) => {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash);
	};

	// Function to calculate time until midnight
	const calculateTimeUntilMidnight = () => {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		const diffMs = tomorrow.getTime() - now.getTime();
		const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

		return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}:${diffSecs
			.toString()
			.padStart(2, '0')}`;
	};

	const fetchDailyQuote = async () => {
		try {
			setIsLoading(true);

			// Generate today's seed based on the date
			const todayString = getTodayString();
			const seed = generateSeed(todayString);

			// Store the API URL
			const baseApiUrl = 'https://api.quotable.io/quotes';
			const tags = 'failure|inspirational|motivational';

			// Fetch a list of quotes instead of just one random quote
			const response = await fetch(`${baseApiUrl}?tags=${tags}&limit=5`);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			if (data.results && data.results.length > 0) {
				// Use the seed to deterministically select a quote for today
				const quoteIndex = seed % data.results.length;
				const dailyQuote = data.results[quoteIndex];
				setQuoteContent(dailyQuote.content);
				setQuoteAuthor(dailyQuote.author);
			} else {
				throw new Error('No quotes found');
			}
		} catch (error) {
			console.error('Error fetching daily quote:', error);
			// Fallback quote in case of error
			setQuoteContent('The best preparation for tomorrow is doing your best today.');
			setQuoteAuthor('H. Jackson Brown Jr.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDailyQuote();

		// Initial countdown
		setCountdown(calculateTimeUntilMidnight());

		// Update countdown every second
		const countdownTimer = setInterval(() => {
			const timeUntilMidnight = calculateTimeUntilMidnight();
			setCountdown(timeUntilMidnight);

			// If it's midnight, fetch a new quote
			if (timeUntilMidnight === '00:00:00') {
				fetchDailyQuote();
			}
		}, 1000);

		return () => clearInterval(countdownTimer);
	}, []);

	return (
		<div className={cx('quote-card', className)}>
			<div className={cx('card-content')}>
				{/* Image container with centering */}
				<div className={cx('image-container')}>
					<Brain3d />
				</div>

				{/* Title */}
				<div className={cx('title')}>
					{new Date().toLocaleDateString('en-GB', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
					})}
				</div>

				{/* Quote content */}
				{isLoading ? (
					<p className={cx('content')}>Loading...</p>
				) : (
					<>
						<p className={cx('content')}>"{quoteContent}"</p>
						<div className={cx('author')}>— {quoteAuthor}</div>
					</>
				)}

				{/* Countdown timer */}

				<div className={cx('countdown')}>New quote in: {countdown}</div>
			</div>
		</div>
	);
};

export {QuoteCard, type QuoteCardProps};
