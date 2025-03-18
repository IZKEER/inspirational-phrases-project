import React from "react"

import classNames from "classnames/bind"
import styles from "./SectionBottomFader.module.scss"

const cx = classNames.bind(styles)

const SectionBottomFader = () => {
	return <div className={cx("bottom-fader")}></div>
}

export {SectionBottomFader}
