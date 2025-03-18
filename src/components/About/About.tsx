import React, {HTMLAttributes} from "react"
import classNames from "classnames/bind"
import Link from "next/link"
import Image from "next/image"
import {SectionContainer} from "../SectionContainer"

import aboutImage from "/public/images/contact-image.png"

import styles from "./About.module.scss"

let cx = classNames.bind(styles)

type AboutProps = {
	title: string
	text?: string
	className?: string
} & HTMLAttributes<HTMLDivElement>

const About = ({text, title, className}: AboutProps) => {
	return (
		<section className={cx("about-section")}>
			<SectionContainer size="lg">
				<div className={cx("about")}>
					<div className={cx("about-text")}>
						<h2>{title}</h2>
						<p className="readable-text">{text}</p>
					</div>
					<div className={cx("about-image")}>
						<Image
							src={aboutImage}
							alt="contact image"
							layout="fill"
							objectFit="cover"
						/>
					</div>
				</div>
			</SectionContainer>
		</section>
	)
}

export {About, type AboutProps}
