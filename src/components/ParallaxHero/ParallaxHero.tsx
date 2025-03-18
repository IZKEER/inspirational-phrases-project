import {SectionBottomFader} from "@components"
import {motion, useMotionTemplate, useScroll, useTransform} from "framer-motion"
import {MdOutlineCodeOff} from "react-icons/md"
import {HTMLAttributes, useEffect, useRef, useState} from "react"
import gsap from "gsap/dist/gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import Link from "next/link"
import centerImage from "public/images/hero-photo.jpg"
import centerImage3 from "public/images/hero-photo3.jpg"
import archImage from "public/images/arch-image.jpg"
import jungleImage from "public/images/jungle-image.jpg"
import runningImage from "public/images/running-photo.jpg"

gsap.registerPlugin(ScrollTrigger)

const SECTION_HEIGHT = 1500

interface Paragraph {
	content: string
	isHighlighted?: boolean
}

interface AboutDescriptionProps {
	paragraphs: Paragraph[]
	date?: string
	location?: string
	description?: string
}

type ParallaxImgProps = {
	alt?: string
	src?: string
	start?: number
	end?: number
} & HTMLAttributes<HTMLDivElement>

const HeroParallax = () => {
	return (
		<div className="bg-zinc-950 relative ">
			<Nav />
			<Hero />
			<About />
		</div>
	)
}

const Nav = () => {
	const [isDarkBackground, setIsDarkBackground] = useState(true)
	const iconRef = useRef(null)

	useEffect(() => {
		// Function to check if a background is dark
		const isDark = (element: Element) => {
			const bgcolor = window.getComputedStyle(element).backgroundColor
			// Convert bgcolor to RGB values
			const match = bgcolor.match(/\d+/g)
			if (match) {
				const [r, g, b] = match.map(Number)
				// Calculate relative luminance
				// Using the formula: (0.299*R + 0.587*G + 0.114*B)
				const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
				return brightness < 0.5
			}
			return true
		}

		// Create intersection observer
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsDarkBackground(isDark(entry.target))
					}
				})
			},
			{
				threshold: [0.5], // Trigger when element is 50% visible
				root: null, // Use viewport as root
				rootMargin: "-50px 0px", // Offset to match nav height
			}
		)

		// Observe all sections that might change background
		const sections = document.querySelectorAll("section")
		sections.forEach((section) => observer.observe(section))

		return () => observer.disconnect()
	}, [])

	return (
		<nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3">
			<Link href={"#"}>
				<MdOutlineCodeOff
					className={`text-2xl transition-colors duration-150 ${
						isDarkBackground ? "text-white" : "text-black"
					}`}
				/>
			</Link>
		</nav>
	)
}

const Hero = () => {
	return (
		<div id="hero" style={{height: `calc(${SECTION_HEIGHT}px + 100vh)`}} className="relative h-screen w-full">
			<CenterImage />
			<ParallaxImages />
			<div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
		</div>
	)
}

// const CenterImage = () => {
// 	const {scrollY} = useScroll()

// 	// Make square by using clip1 for both x and y in first coordinates
// 	const clip1 = useTransform(scrollY, [35, 1500], [25, 0])
// 	const clip2 = useTransform(scrollY, [35, 1500], [75, 100])

// 	// Use clip1 for both x and y in first half of coordinates
// 	// const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`
// 	const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`

// 	// Rest remains same
// 	const backgroundSize = useTransform(
// 		scrollY,
// 		[0, SECTION_HEIGHT + 500],
// 		["115%", "100%"]
// 	)
// 	const opacity = useTransform(
// 		scrollY,
// 		[SECTION_HEIGHT, SECTION_HEIGHT + 500],
// 		[0.8, 0.05]
// 	)

// 	return (
// 		<motion.div
// 			className="sticky top-0 h-screen w-full"
// 			style={{
// 				clipPath,
// 				backgroundSize,
// 				opacity,
// 				backgroundImage: `url(${centerImage3.src})`,
// 				backgroundPosition: "40% 80%",
// 				backgroundRepeat: "no-repeat",
// 			}}
// 		/>
// 	)
// }

const CenterImage = () => {
	const {scrollY} = useScroll()

	const clip1 = useTransform(scrollY, [0, 1500], [25, 0])
	const clip2 = useTransform(scrollY, [0, 1500], [75, 100])

	const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`

	const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["120%", "100%"])
	const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0])

	return (
		<motion.div
			className="sticky top-0 h-screen w-full bg-[position:40%_50%] md:bg-[position:40%_90%]"
			style={{
				clipPath,
				backgroundSize,
				opacity,
				backgroundImage: `url(${centerImage3.src})`,
				// backgroundImage:
				// "url(https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",

				// backgroundPosition: "40% 60%",
				backgroundRepeat: "no-repeat",
			}}
		/>
	)
}

const ParallaxImages = () => {
	return (
		<div className="mx-auto max-w-5xl px-4 pt-[200px]">
			<ParallaxImg
				// src="https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				src={archImage.src}
				alt="And example of a space launch"
				start={-200}
				end={200}
				className="w-1/3"
			/>
			<ParallaxImg
				// src="https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				src={jungleImage.src}
				alt="An example of a space launch"
				start={200}
				end={-250}
				className="mx-auto w-2/4"
			/>
			<ParallaxImg
				// src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				src={runningImage.src}
				alt="Orbiting satellite"
				start={-200}
				end={-150}
				className="ml-auto w-1/4"
			/>
		</div>
	)
}

const ParallaxImg = ({className, alt, src, start = 0, end = 0}: ParallaxImgProps) => {
	const ref = useRef<HTMLImageElement>(null)

	const {scrollYProgress} = useScroll({
		target: ref,
		offset: [`${start}px end`, `end ${end * -1}px`],
	})

	const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
	const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])

	const y = useTransform(scrollYProgress, [0, 1], [start, end])
	const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

	return <motion.img src={src} alt={alt} className={className} ref={ref} style={{transform, opacity}} />
}

const About = () => {
	const aboutContent: {paragraphs: Paragraph[]} = {
		paragraphs: [
			{
				content: "I'm Marcelo Santos, a frontend developer from the beautiful city of Leiria, Portugal.",
			},
			{
				content:
					"My coding journey kicked off when I discovered how much I love solving puzzles and building things from scratch – turns out, frontend development was my perfect match!",
			},
			{
				content:
					"I'm currently diving deep into the world of React and TypeScript, and I've been having a blast learning Next.js.",
			},

			{
				content:
					"I also work with OutSystems, which has been a great platform for understanding how different pieces of an application fit together.",
			},
			{
				content:
					"One of my favorite things is playing around with GSAP animations – there's something magical about bringing life to static websites!",
			},
			{
				content:
					"As someone who's constantly learning, I love working with other developers and designers. Every project is a chance to pick up new tricks and better ways of doing things. While I may not be a senior developer (yet!), I make up for it with enthusiasm and a dedication.",
			},
			{
				content:
					"When I'm not coding, you'll probably find me tinkering with side projects or exploring new dev tools – I'm a firm believer that the best way to learn is by doing. I'm always excited to connect with fellow developers and work on interesting projects!",
			},
		],
	}

	return (
		<section id="about" className="mx-auto max-w-3xl sm:max-w-5xl px-4 text-white py-16">
			<motion.h1
				initial={{x: -100, opacity: 0}}
				whileInView={{x: 0, opacity: 1}}
				transition={{ease: "easeInOut", duration: 0.75}}
				className="mb-12 text-heading uppercase text-zinc-50 text-center md:text-left">
				HEY 😉
			</motion.h1>
			<AnimatedAboutDescription paragraphs={aboutContent.paragraphs} />
		</section>
	)
}

const AnimatedAboutDescription: React.FC<AboutDescriptionProps> = ({paragraphs, date, location, description}) => {
	const wrapLetters = (text: string) => {
		const words = text.split(" ")

		return words.map((word, wordIndex) => (
			<span key={`word-${wordIndex}`} className="inline-block">
				{word.split("").map((char, charIndex) => (
					<span key={`${wordIndex}-${charIndex}`} className="opacity-25 inline-block">
						{char}
					</span>
				))}
				{wordIndex < words.length - 1 && <span className="inline-block mr-[0.2em]">&nbsp;</span>}
			</span>
		))
	}

	const animationContainerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!animationContainerRef.current) return

		const letters = Array.from(animationContainerRef.current.querySelectorAll("span > span")).filter(
			(span) => span.textContent && span.textContent.trim() !== ""
		)

		const tween = gsap.to(letters, {
			opacity: 1,
			duration: 0.1,
			stagger: {
				each: 0.02,
				from: "start",
			},
			ease: "none",
			scrollTrigger: {
				trigger: animationContainerRef.current,
				start: "top 40%",
				end: "bottom 40%",
				// markers: true,
				scrub: 0.5,
				toggleActions: "play none none reverse",
			},
		})

		// Only kill this component's ScrollTrigger
		return () => {
			tween.kill()
		}
	}, [paragraphs])

	return (
		<div className="mb-9 flex flex-col border-b border-zinc-800 pb-9">
			<div ref={animationContainerRef} className="space-y-4">
				{paragraphs.map((paragraph, index) => (
					<p
						key={index}
						className={" md:text-xl lg:text-3xl text-zinc-50"}
						style={{
							overflowWrap: "break-word",
							wordWrap: "break-word",
							wordBreak: "normal",
							hyphens: "none",
						}}>
						{wrapLetters(paragraph.content)}
					</p>
				))}
			</div>
		</div>
	)
}

export {HeroParallax}
