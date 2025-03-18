import React, {HTMLAttributes, useEffect} from "react"
import classNames from "classnames/bind"
import {SectionContainer} from "../SectionContainer"
import styles from "./Contact.module.scss"
import Image from "next/image"
import ContactImage from "public/images/contact-image.png"

import {ConversationalForm} from "../ConversationalForm"

let cx = classNames.bind(styles)

type ContactProps = {
	title: string
	subTitle?: string
	leftImage?: string
	avatarName?: string
	avatarCareer?: string
	contactLink?: string
	className?: string
	reversed?: boolean
} & HTMLAttributes<HTMLDivElement>

const Contact = ({title, reversed = false}: ContactProps) => {
	return (
		<section className={cx("contact")}>
			<SectionContainer size="lg">
				<div className={cx("contact-grid", {"contact-grid-reversed": reversed})}>
					<div className={cx("contact-left")}>
						<Image
							src={ContactImage}
							alt={"contact-image"}
						/>
					</div>
					<div className={cx("contact-right")}>
						<ConversationalForm />
					</div>
				</div>
			</SectionContainer>
		</section>
	)
}

export {Contact, type ContactProps as contactProps}
