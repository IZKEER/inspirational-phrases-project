import React, {HTMLAttributes, useEffect, useState} from 'react';
import classNames from 'classnames/bind';

import styles from './QuoteCard.module.scss';
import {Brain3d} from '../Brain3d';

let cx = classNames.bind(styles);

type Quote = {
  content: string;
  author: string;
  tags: string[];
  _id: string;
};

type QuoteCardProps = {
	title?: string;
	initialContent?: string;
	initialAuthor?: string;
	imageSrc?: string;
	className?: string;
} & HTMLAttributes<HTMLDivElement>;

// Local fallback quotes - these will always work
const FALLBACK_QUOTES: Quote[] = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tags: ["inspirational", "motivational"],
    _id: "fallback-1"
  },
  {
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill", 
    tags: ["motivational", "failure"],
    _id: "fallback-2"
  },
  {
    content: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    tags: ["inspirational", "motivational"],
    _id: "fallback-3"
  },
  {
    content: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    tags: ["motivational", "inspirational"],
    _id: "fallback-4"
  },
  {
    content: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    tags: ["inspirational", "motivational"],
    _id: "fallback-5"
  },
  {
    content: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    tags: ["motivational", "inspirational"],
    _id: "fallback-6"
  },
  {
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tags: ["inspirational", "motivational"],
    _id: "fallback-7"
  },
  {
    content: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    tags: ["inspirational", "failure"],
    _id: "fallback-8"
  },
  {
    content: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett",
    tags: ["motivational", "inspirational"],
    _id: "fallback-9"
  },
  {
    content: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    tags: ["motivational", "inspirational"],
    _id: "fallback-10"
  }
];

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

	// Function to get quote from local fallback quotes
	const getLocalQuote = () => {
		const todayString = getTodayString();
		const seed = generateSeed(todayString);
		const quoteIndex = seed % FALLBACK_QUOTES.length;
		const dailyQuote = FALLBACK_QUOTES[quoteIndex];
		
		setQuoteContent(dailyQuote.content);
		setQuoteAuthor(dailyQuote.author);
	};

	const fetchDailyQuote = async () => {
		try {
			setIsLoading(true);

			// Generate today's seed based on the date
			const todayString = getTodayString();
			const seed = generateSeed(todayString);

			// Try our Next.js API route first
			try {
				const response = await fetch('/api/quotes?tags=failure|inspirational|motivational&limit=5');
				
				if (response.ok) {
					const data = await response.json();
					if (data.results && data.results.length > 0) {
						const quoteIndex = seed % data.results.length;
						const dailyQuote = data.results[quoteIndex];
						setQuoteContent(dailyQuote.content);
						setQuoteAuthor(dailyQuote.author);
						return; // Success! Exit early
					}
				}
				throw new Error('API route failed');
			} catch (apiError) {
				// If API route fails, try external API directly
				try {
					const response = await fetch('https://api.quotable.io/quotes?tags=failure|inspirational|motivational&limit=5');
					if (response.ok) {
						const data = await response.json();
						if (data.results && data.results.length > 0) {
							const quoteIndex = seed % data.results.length;
							const dailyQuote = data.results[quoteIndex];
							setQuoteContent(dailyQuote.content);
							setQuoteAuthor(dailyQuote.author);
							return; // Success! Exit early
						}
					}
					throw new Error('External API failed');
				} catch (externalError) {
					// If both fail, use local quotes silently
					getLocalQuote();
				}
			}
		} catch (error) {
			console.error('Error in fetchDailyQuote:', error);
			// Final fallback - use local quotes
			getLocalQuote();
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
					<p className={cx('content')}>Loading inspiring thoughts...</p>
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
