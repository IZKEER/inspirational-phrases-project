import React, {HTMLAttributes} from 'react';
import classNames from 'classnames/bind';

import styles from './QuoteCard.module.scss';
import {Brain3d} from '../Brain3d';

let cx = classNames.bind(styles);

type QuoteCardProps = {
	title?: string;
	content?: string;
	author?: string;
	imageSrc?: string;
	className?: string;
} & HTMLAttributes<HTMLDivElement>;

const QuoteCard = ({title, content, author, imageSrc, className}: QuoteCardProps) => {
	return (
		<div className={cx('quote-card', className)}>
			<div className={cx('card-content')}>
				{/* Image container with centering */}
				<div className={cx('image-container')}>
					<Brain3d />
				</div>

				{/* Title */}
				<div className={cx('title')}>{title}</div>

				{/* Quote content */}
				<p className={cx('content')}>"{content}"</p>

				{/* Author attribution */}
				<div className={cx('author')}>— {author}</div>
			</div>
		</div>
	);
};

export {QuoteCard, type QuoteCardProps};
