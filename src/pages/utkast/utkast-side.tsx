import React from 'react';
import { UtkastFooter } from './footer/utkast-footer';
import SkjemaHeader from './skjema-section/header/skjema-header';
import { useDataStore } from '../../stores/data-store';
import { useSkjemaStore } from '../../stores/skjema-store';
import { useTilgangStore } from '../../stores/tilgang-store';
import { DialogSectionHeader } from './dialog-section/dialog-section-header';
import { DialogSectionInnhold } from './dialog-section/dialog-section-innhold';
import { EndreSkjemaSection } from './skjema-section/endre-skjema-section';
import { LesSkjemaSection } from './skjema-section/les-skjema-section';
import './utkast-side.less';

export function UtkastSide() {
	const { utkast } = useDataStore();
	const { sistOppdatert } = useSkjemaStore();
	const { erAnsvarligVeileder } = useTilgangStore();

	const utkastSkjema = erAnsvarligVeileder ? <EndreSkjemaSection /> : <LesSkjemaSection />;

	return (
		<div className="utkast-side">
			<div className="utkast-side__hovedinnhold">
				<div className="utkast-side__skjema-section">
					<SkjemaHeader utkast={utkast!} sistOppdatert={sistOppdatert} />
					{utkastSkjema}
				</div>
				<div className="utkast-side__dialog-section">
					<DialogSectionHeader beslutterNavn={utkast?.beslutterNavn} />
					<DialogSectionInnhold />
				</div>
			</div>
			<div className="utkast-side__footer">
				<UtkastFooter />
			</div>
		</div>
	);
}
