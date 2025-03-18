import React, {HTMLAttributes} from "react"
import classNames from "classnames/bind"
import Link from "next/link"

import {SectionContainer} from "../SectionContainer"

import styles from "./Logo.module.scss"

let cx = classNames.bind(styles)

type LogoProps = {
	text?: string
	className?: string
} & HTMLAttributes<HTMLDivElement>

const Logo = ({text, className}: LogoProps) => {
	return (
		<SectionContainer size="fluid">
			<div className={cx("logo-wrapper", className)}>
				<Link
					href="#hero"
					aria-label="3">
					<span className={cx("logo")}>{text}</span>
				</Link>
			</div>
		</SectionContainer>
	)
}

export {Logo, type LogoProps}
