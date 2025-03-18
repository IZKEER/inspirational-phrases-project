import "../styles/global.css"
import "../styles/global.scss"

import {useState, useEffect, useRef} from "react"
import type {AppProps} from "next/app"
import gsap from "gsap"

import {Preloader} from "@/components/Preloader/Preloader"

export default function App({Component, pageProps}: AppProps) {
	const [loading, setLoading] = useState(true)
	const componentRef = useRef<HTMLDivElement>(null)

	// Add effect to handle scroll restoration
	useEffect(() => {
		// This prevents the browser's default scroll restoration
		if ("scrollRestoration" in window.history) {
			window.history.scrollRestoration = "manual"
		}

		// Force scroll to top on page load/refresh
		window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		if (componentRef.current) {
			gsap.set(componentRef.current, {opacity: 0})
		}
	}, [])

	useEffect(() => {
		document.body.style.overflow = loading ? "hidden" : ""
		return () => {
			document.body.style.overflow = "auto"
		}
	}, [loading])

	const handlePreloaderFinish = () => {
		if (componentRef.current) {
			gsap.to(componentRef.current, {
				opacity: 1,
				duration: 1.5,
				ease: "power2.inOut",
				onComplete: () => {
					setLoading(false)
					// Add an additional scroll to top after animation
					window.scrollTo(0, 0)
				},
			})
		}
	}

	return (
		<>
			{loading && <Preloader onFinish={handlePreloaderFinish} />}
			<div
				ref={componentRef}
				style={{opacity: 0}}>
				<Component {...pageProps} />
			</div>
		</>
	)
}
