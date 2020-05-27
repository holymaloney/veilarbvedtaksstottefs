import React, { useState } from 'react';
import tipsBilde from './tips.svg';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import './tips-popover.less';

interface TipsPopoverProps {
	id: string;
	tipsInnhold: React.ReactNode;
}

/*
Scroll events blir ikke trigget lokalt fordi height er satt til 100%.
Dette gjør at popover innholdet ikke følger med når man scroller.
I test/prod skal ikke dette være et problem.
*/

export const TipsPopover = (props: TipsPopoverProps) => {
	const [popoverTrigger, setPopoverTrigger] = useState<HTMLButtonElement>();

	function handleOnRequestOpen(e: React.MouseEvent<HTMLButtonElement>) {
		setPopoverTrigger(e.currentTarget);
	}

	function handleOnRequestClose() {
		setPopoverTrigger(undefined);
	}

	return (
		<div className="tips-popover">
			<button
				className="tips-popover__trigger"
				onClick={handleOnRequestOpen}
				type="button"
				aria-expanded={popoverTrigger !== undefined}
				aria-controls={props.id}
				aria-haspopup="dialog"
			>
				<img src={tipsBilde} className="tips-popover__trigger-img" alt="Info-ikon" />
			</button>
			<Popover
				id={props.id}
				autoFokus={false}
				avstandTilAnker={16}
				ankerEl={popoverTrigger}
				orientering={PopoverOrientering.Hoyre}
				onRequestClose={handleOnRequestClose}
			>
				<div className="tips">
					{props.tipsInnhold}
				</div>
			</Popover>
		</div>
	);
};
