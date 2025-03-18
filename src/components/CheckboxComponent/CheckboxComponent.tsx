import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import {Check} from "lucide-react"
import classNames from "classnames/bind"
import styles from "./Checkbox.module.scss"

const cx = classNames.bind(styles)

type CheckboxElement = React.ElementRef<typeof CheckboxPrimitive.Root>
type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const CheckboxComponent = React.forwardRef<CheckboxElement, CheckboxProps>(
	({className, ...props}, ref) => (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cx("checkbox__root", className)}
			{...props}>
			<CheckboxPrimitive.Indicator className={cx("checkbox__indicator")}>
				<Check className={cx("checkbox__check")} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
)

export {CheckboxComponent, type CheckboxProps as CheckboxProps}
