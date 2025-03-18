import React, {HTMLAttributes, ReactNode} from "react"
import classNames from "classnames/bind"

import styles from "./SectionContainer.module.scss"

let cx = classNames.bind(styles)

type ContainerProps = {
	size?: "sm" | "md" | "lg" | "fluid"
	ref?: React.RefObject<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const SectionContainer = ({
	size = "lg",
	children,
	ref,
	className,
}: ContainerProps & {children: ReactNode}) => {
	return <div className={cx("section-container", ref, size, className)}>{children}</div>
}
export {SectionContainer, type ContainerProps}
