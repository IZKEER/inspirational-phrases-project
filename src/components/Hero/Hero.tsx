import React, {HTMLAttributes, useRef} from "react"
import Image from "next/image"
import heroImage from "/public/images/hero-image.jpg"
import gsap from "gsap/dist/gsap"
import {useGSAP} from "@gsap/react"
import {ScrollTrigger} from "gsap/dist/ScrollTrigger"
import {Draggable} from "gsap/dist/Draggable"

import classNames from "classnames/bind"
import styles from "./Hero.module.scss"
const cx = classNames.bind(styles)

import {SectionContainer} from "../SectionContainer"
import {SectionBottomFader} from "../SectionBottomFader"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type HeroProps = {
	text: string
	image?: string
} & HTMLAttributes<HTMLDivElement>

const Hero = ({text, image, className}: HeroProps) => {
	const titleRef = useRef<HTMLDivElement | null>(null)

	useGSAP(() => {
		if (titleRef.current) {
			const viewportWidth = window.innerWidth
			const elementWidth = titleRef.current.getBoundingClientRect().width
			const xPosition = viewportWidth - elementWidth / 2

			const isMobile = window.innerWidth < 768
			const scaleValue = isMobile ? 3 : 7

			gsap.fromTo(
				titleRef.current,
				{
					opacity: 0,
					y: "50dvh",
					x: "-150dvh",
				},
				{
					y: "0dvh",
					x: "0dvh",
					opacity: 1,
					duration: 0,
				}
			)

			ScrollTrigger.create({
				animation: gsap.fromTo(
					titleRef.current,
					{
						scrub: 1,
						y: "50dvh",
						scale: isMobile ? 2 : 4,
						opacity: 1,
					},
					{
						y: 0,
						opacity: 0,
						scale: 1,
						duration: 2,
					}
				),

				scrub: 1,
				trigger: titleRef.current,
				start: "top center",
				// markers: {
				// 	startColor: "green",
				// 	endColor: "orange",
				// 	fontSize: "18px",
				// },
			})
		}
	}, [])

	return (
		<section className={cx("hero")}>
			<SectionContainer
				size="fluid"
				className={cx("hero-container", className)}>
				<div
					className={cx("hero-nav-text")}
					ref={titleRef}>
					<h1>{text}</h1>
				</div>
				<div className={cx("hero-empty-container")}></div>
				{/* <div className={cx("hero-image")}>
					<Image
						src={heroImage}
						alt="Hero"
						width={1440}
						height={1440}
					/>
				</div> */}
			</SectionContainer>
			<SectionBottomFader />
		</section>
	)
}

export {Hero, type HeroProps}
