import '../styles/global.css';
import '../styles/global.scss';

import {useState, useEffect, useRef} from 'react';
import type {AppProps} from 'next/app';

import {Preloader} from '@/components/Preloader/Preloader';

export default function App({Component, pageProps}: AppProps) {
	// Temporarily disable preloader for debugging
	const [loading, setLoading] = useState(false); // Changed from true to false
	const componentRef = useRef<HTMLDivElement>(null);

	// Add effect to handle scroll restoration
	useEffect(() => {
		// This prevents the browser's default scroll restoration
		if ('scrollRestoration' in window.history) {
			window.history.scrollRestoration = 'manual';
		}

		// Force scroll to top on page load/refresh
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		document.body.style.overflow = loading ? 'hidden' : '';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [loading]);

	const handlePreloaderFinish = () => {
		setLoading(false);

		// Ensure we're at the top of the page
		window.scrollTo(0, 0);

		// Make main content visible
		if (componentRef.current) {
			componentRef.current.style.opacity = '1';
		}
	};

	return (
		<>
			{loading && <Preloader onFinish={handlePreloaderFinish} />}
			<div
				ref={componentRef}
				style={{
					opacity: 1, // Changed from 0 to 1 - make content visible immediately
					transition: 'opacity 1s ease-in-out',
				}}>
				<Component {...pageProps} />
			</div>
		</>
	);
}
