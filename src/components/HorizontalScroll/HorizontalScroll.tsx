import React, {HTMLAttributes, useRef} from "react"
import gsap from "gsap/dist/gsap"
import {useGSAP} from "@gsap/react"
import {ScrollTrigger} from "gsap/dist/ScrollTrigger"

import classNames from "classnames/bind"

import styles from "./HorizontalScroll.module.scss"
import ReactLenis from "@studio-freight/react-lenis/types"

let cx = classNames.bind(styles)

type HorizontalScrollProps = {
	className?: string
	children?: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

const HorizontalScroll = ({children, className}: HorizontalScrollProps) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		gsap.registerPlugin(ScrollTrigger)

		const sections = scrollRef.current
		const container = triggerRef.current

		if (sections && container) {
			gsap.to(sections, {
				x: () => -(sections.scrollWidth - document.documentElement.clientWidth),
				ease: "none",
				scrollTrigger: {
					trigger: container,
					start: "top top",
					end: () =>
						`+=${
							sections.scrollWidth - document.documentElement.clientWidth
						}`,
					scrub: 1,
					pin: true,
					anticipatePin: 1,
					// snap: 1 / (sections.children.length - 1),
					// markers: true,
				},
			})
		}

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
		}
	}, [])

	return (
		<section
			ref={triggerRef}
			className={cx("horizontal-section")}>
			<div
				ref={scrollRef}
				className={cx("horizontal-container")}>
				{children}
			</div>
		</section>
	)
}

export {HorizontalScroll}
