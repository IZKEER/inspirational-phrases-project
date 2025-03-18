import {useRef} from "react"
import gsap from "gsap"
import {useGSAP} from "@gsap/react"
import classNames from "classnames/bind"

import "./Preloader.module.scss"
import styles from "./Preloader.module.scss"
let cx = classNames.bind(styles)

const Preloader = ({onFinish}: {onFinish: () => void}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLDivElement>(null)
	const beamRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		if (containerRef.current && textRef.current && beamRef.current) {
			const timeline = gsap.timeline({
				onComplete: onFinish,
			})

			// Reset initial positions
			gsap.set(beamRef.current, {left: "-100%"})
			gsap.set(textRef.current, {
				WebkitMaskPosition: "-40% 0",
				maskPosition: "-40% 0",
			})

			// Animate the beam and mask position
			timeline
				.to([beamRef.current], {
					left: "200%",
					duration: 0,
					ease: "back.in(0)",
				})
				.to(
					textRef.current,
					{
						WebkitMaskPosition: "200% 0",
						maskPosition: "150% 0",
						duration: 5,
						ease: "back.in(0)",
					},
					0
				) // Start at the same time as beam animation
				// Right to left reveal
				.set(textRef.current, {
					WebkitMaskImage:
						"linear-gradient(90deg, transparent 0%, white 40%, white 60%, transparent 100%)",
					maskImage:
						"linear-gradient(90deg, transparent 0%, white 40%, white 60%, transparent 100%)",
					WebkitMaskPosition: "50% 100%",
					maskPosition: "50% 100%",
					WebkitMaskSize: "0% 100%",
					maskSize: "0% 100%",
				})
				.to(textRef.current, {
					WebkitMaskSize: "100% 100%",
					maskSize: "100% 100%",
					WebkitMaskImage: "linear-gradient(90deg, white 0%, white 100%)",
					maskImage: "linear-gradient(90deg, white 0%, white 100%)",
					ease: "back.in(0)",
					duration: 0.5,
				})
				// Add a pause
				.to({}, {duration: 1.5})
				// Then fade out
				.to(containerRef.current, {
					opacity: 0,
					duration: 1,
				})

			return () => timeline.kill()
		}
	}, [onFinish])

	return (
		<div
			ref={containerRef}
			className={cx("preloader")}>
			<div
				ref={textRef}
				className={cx("preloader__text")}>
				Marcelo Santos
				<div
					ref={beamRef}
					className={cx("preloader__beam")}
				/>
			</div>
		</div>
	)
}

export {Preloader}
