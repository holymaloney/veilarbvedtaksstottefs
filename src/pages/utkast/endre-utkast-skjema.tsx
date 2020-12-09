import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { hentMalformFraData, SkjemaData } from '../../utils/skjema-utils';
import { fetchBeslutterprosessStatus, fetchOppdaterVedtakUtkast } from '../../rest/api';
import { ModalType, useModalStore } from '../../stores/modal-store';
import { useSkjemaStore } from '../../stores/skjema-store';
import {
	erBeslutterProsessStartet,
	erGodkjentAvBeslutter,
	erKlarTilBeslutter,
	finnGjeldendeVedtak,
	hentId
} from '../../utils';
import { useIsAfterFirstRender } from '../../utils/hooks';
import { BeslutterProsessStatus } from '../../rest/data/vedtak';
import { useDataStore } from '../../stores/data-store';
import './utkast-side.less';
import { SkjemaLagringStatus } from '../../utils/types/skjema-lagring-status';
import Opplysninger from './skjema/opplysninger/opplysninger';
import Begrunnelse from './skjema/begrunnelse/begrunnelse';
import Innsatsgruppe from './skjema/innsatsgruppe/innsatsgruppe';
import Hovedmal from './skjema/hovedmal/hovedmal';
import { SKRU_AV_POLLING_UTKAST } from '../../rest/data/features';
import { useVarselStore } from '../../stores/varsel-store';
import { VarselType } from '../../components/varsel/varsel-type';

const TEN_SECONDS = 10000;

export function EndreUtkastSkjema() {
	const { fattedeVedtak, malform, utkast, features, setBeslutterProsessStatus } = useDataStore();
	const { showModal } = useModalStore();
	const {
		opplysninger,
		hovedmal,
		innsatsgruppe,
		begrunnelse,
		sistOppdatert,
		setSistOppdatert,
		validerSkjema,
		validerBegrunnelseLengde,
		lagringStatus,
		setLagringStatus
	} = useSkjemaStore();
	const { showVarsel } = useVarselStore();

	const pollBeslutterstatusIntervalRef = useRef<number>();
	const [harForsoktAttSende, setHarForsoktAttSende] = useState<boolean>(false);
	const isAfterFirstRender = useIsAfterFirstRender();

	const oppdaterUtkast = useCallback(
		debounce((skjema: SkjemaData) => {
			const malformType = hentMalformFraData(malform);

			setLagringStatus(SkjemaLagringStatus.LAGRER);
			fetchOppdaterVedtakUtkast({ vedtakId: hentId(utkast), skjema, malform: malformType })
				.then(() => {
					setLagringStatus(SkjemaLagringStatus.ALLE_ENDRINGER_LAGRET);
					setSistOppdatert(new Date().toISOString());
				})
				.catch(() => {
					showModal(ModalType.FEIL_VED_LAGRING);
					setLagringStatus(SkjemaLagringStatus.LAGRING_FEILET);
				});
		}, 3000),
		[]
	);

	const vedtakskjema = { opplysninger, begrunnelse, innsatsgruppe, hovedmal };

	useEffect(() => {
		// Initialiser når utkastet åpnes
		setLagringStatus(SkjemaLagringStatus.INGEN_ENDRING);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (harForsoktAttSende) {
			validerSkjema(finnGjeldendeVedtak(fattedeVedtak));
		} else {
			validerBegrunnelseLengde();
		}

		if (isAfterFirstRender) {
			if (lagringStatus !== SkjemaLagringStatus.ENDRING_IKKE_LAGRET) {
				setLagringStatus(SkjemaLagringStatus.ENDRING_IKKE_LAGRET);
			}

			oppdaterUtkast(vedtakskjema);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opplysninger, begrunnelse, innsatsgruppe, hovedmal]);

	useEffect(() => {
		if (!utkast || features[SKRU_AV_POLLING_UTKAST]) {
			return;
		}

		const stopPolling = () => {
			if (pollBeslutterstatusIntervalRef.current) {
				clearInterval(pollBeslutterstatusIntervalRef.current);
				pollBeslutterstatusIntervalRef.current = undefined;
			}
		};

		const erStartet = erBeslutterProsessStartet(utkast.beslutterProsessStatus);
		const erGodkjent = erGodkjentAvBeslutter(utkast.beslutterProsessStatus);
		const erHosBeslutter = erKlarTilBeslutter(utkast.beslutterProsessStatus);

		/*
            Hvis beslutterprosessen har startet og innlogget bruker er ansvarlig veileder så skal vi periodisk hente
            status for beslutterprosessen, slik at handlinger kan utføres av veileder ved endringer fra beslutter, uten refresh av siden:
                - hvis beslutter har satt utkastet tilbake til veileder, så kan veileder sette utkastet tilbake til beslutter
                - hvis beslutter har godkjent utkastet, så kan veileder sende vedtaket

            Polling skjer kun dersom utkastet er hos beslutter, så dersom utkastet er hos veileder og beslutter godkjenner, så vil ikke
            statusen bli oppdatert av pollingen.
        */
		if (erStartet && !erGodkjent && erHosBeslutter) {
			pollBeslutterstatusIntervalRef.current = (setInterval(() => {
				fetchBeslutterprosessStatus(utkast.id).then(response => {
					if (response.data && response.data.status) {
						varsleBeslutterProsessStatusEndring(response.data.status);
						setBeslutterProsessStatus(response.data.status);
					}
				});
			}, TEN_SECONDS) as unknown) as number;
			// NodeJs types are being used instead of browser types so we have to override
		} else if (erGodkjent) {
			// Trenger ikke å polle lenger hvis utkastet er godkjent
			stopPolling();
		}

		return stopPolling;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [utkast]);

	function varsleBeslutterProsessStatusEndring(nyStatus: BeslutterProsessStatus) {
		if (utkast && nyStatus !== utkast.beslutterProsessStatus) {
			switch (nyStatus) {
				case BeslutterProsessStatus.KLAR_TIL_VEILEDER:
					showVarsel(VarselType.BESLUTTERPROSESS_TIL_VEILEDER);
					break;
				case BeslutterProsessStatus.GODKJENT_AV_BESLUTTER:
					showVarsel(VarselType.BESLUTTERPROSESS_GODKJENT);
					break;
			}
		}
	}

	useEffect(() => {
		// Det kan bli problemer hvis gamle oppdateringer henger igjen etter at brukeren har forlatt redigeringssiden.
		// Oppdateringen kan f.eks bli sendt etter at vedtaket har blitt fattet, eller at utkastet blir oppdatert med gammel data.
		return oppdaterUtkast.cancel;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<form className="endre-utkast-skjema">
			<div>
				<Opplysninger />
				<Innsatsgruppe />
				<Hovedmal />
			</div>
			<Begrunnelse />
		</form>
	);
}
