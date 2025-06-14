import React, {useState, useEffect} from 'react';
import {Check, X, AlertCircle} from 'lucide-react';
import classNames from 'classnames/bind';

import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

interface ToastProps {
	message: string;
	type?: 'success' | 'error' | 'info';
	duration?: number;
	onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({message, type = 'success', duration = 3000, onClose}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger animation
		setIsVisible(true);

		// Auto close
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(onClose, 300); // Wait for animation to complete
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const icons = {
		success: Check,
		error: X,
		info: AlertCircle,
	};

	const Icon = icons[type];

	return (
		<div className={cx('toast-container', {visible: isVisible})}>
			<div className={cx('toast', type)}>
				<Icon className={cx('icon')} size={20} />
				<span className={cx('message')}>{message}</span>
				<button
					className={cx('close-button')}
					onClick={() => {
						setIsVisible(false);
						setTimeout(onClose, 300);
					}}
					aria-label="Close notification">
					<X size={16} />
				</button>
			</div>
		</div>
	);
};

export type {ToastProps};
