import { FetchInfo } from './utils';
import { ALL_TOGGLES } from './data/features';
import { mapOpplysningerFraBokmalTilBrukersMalform, SkjemaData } from '../utils/skjema-utils';
import { MalformType } from './data/malform';

export interface SendDialogFetchParams {
	vedtakId: number;
	melding: string;
}

export interface FnrFetchParams {
	fnr: string;
}

export interface VedtakIdFetchParams {
	vedtakId: number;
}

export interface HentOyblikksbildeFetchParams {
	fnr: string;
	vedtakId: number;
}

export interface OppdaterUtkastFetchParams {
	vedtakId: number;
	malform: MalformType | null;
	skjema: SkjemaData;
}

export const FEATURE_TOGGLE_URL = '/veilarbpersonflatefs/api/feature';
export const VEILARBOPPFOLGING_API = '/veilarboppfolging/api';
export const VEILARBPERSON_API = '/veilarbperson/api';
export const VEILARBVEDTAKSSTOTTE_API = '/veilarbvedtaksstotte/api';
export const VEILARBVEILEDER_API = '/veilarbveileder/api';

const credentials = 'same-origin';

export const HEADERS_WITH_JSON_CONTENT = {
	'Content-Type': 'application/json'
};

export const lagHentFeaturesFetchInfo = (): FetchInfo => {
	const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
	return { url: `${FEATURE_TOGGLE_URL}/?${toggles}` };
};

export const lagHentOppfolgingDataFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBOPPFOLGING_API}/oppfolging?fnr=${params.fnr}`
});

export const lagHentTilgangTilKontorFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBOPPFOLGING_API}/oppfolging/veilederTilgang?fnr=${params.fnr}`
});

export const lagHentMalformFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBPERSON_API}/person/${params.fnr}/malform`
});

export const lagHentVeilederFetchInfo = (): FetchInfo => ({
	credentials,
	url: `${VEILARBVEILEDER_API}/veileder/me`
});

export const lagNyttUtkastFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/utkast`,
	method: 'POST',
	headers: HEADERS_WITH_JSON_CONTENT,
	body: JSON.stringify({ fnr: params.fnr })
});

export const lagOppdaterVedtakUtkastFetchInfo = (params: OppdaterUtkastFetchParams): FetchInfo => {
	params.skjema.opplysninger = mapOpplysningerFraBokmalTilBrukersMalform(params.skjema.opplysninger, params.malform);
	return {
		credentials,
		url: `${VEILARBVEDTAKSSTOTTE_API}/utkast/${params.vedtakId}`,
		method: 'PUT',
		headers: HEADERS_WITH_JSON_CONTENT,
		body: JSON.stringify(params.skjema)
	};
};

export const lagHentUtkastFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/utkast?fnr=${params.fnr}`
});

export const lagHentFattedeVedtakFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/vedtak/fattet?fnr=${params.fnr}`
});

export const lagHentArenaVedtakFetchInfo = (params: FnrFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/vedtak/arena?fnr=${params.fnr}`
});

export const lagFattVedtakFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/utkast/${params.vedtakId}/fattVedtak`,
	method: 'POST',
});

export const lagSendDialogFetchInfo = (params: SendDialogFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/meldinger?vedtakId=${params.vedtakId}`,
	method: 'POST',
	headers: HEADERS_WITH_JSON_CONTENT,
	body: JSON.stringify({ melding: params.melding })
});

export const lagHentMeldingerFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/meldinger?vedtakId=${params.vedtakId}`
});

export const lagSlettUtkastFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/utkast/${params.vedtakId}`,
	method: 'DELETE'
});

export const lagErUtkastGodkjentFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/utkast/${params.vedtakId}/erGodkjent`,
	method: 'GET'
});

export const lagTaOverUtkastFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/utkast/${params.vedtakId}/overta`,
	method: 'POST'
});

export const lagHentOyblikksbildeFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/vedtak/${params.vedtakId}/oyeblikksbilde`
});

export const lagHentForhandsvisningUrl = (vedtakId: number): string => `${VEILARBVEDTAKSSTOTTE_API}/utkast/${vedtakId}/pdf`;

export const lagHentVedtakPdfUrl = (vedtakId: number): string =>
	`${VEILARBVEDTAKSSTOTTE_API}/vedtak/${vedtakId}/pdf`;

export const lagHentArenaVedtakPdfUrl = (dokumentInfoId: string, journalpostId: string): string =>
	`${VEILARBVEDTAKSSTOTTE_API}/vedtak/arena/pdf?dokumentInfoId=${dokumentInfoId}&journalpostId=${journalpostId}`;

export const lagStartBeslutterProsessFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/beslutter/start?vedtakId=${params.vedtakId}`,
	method: 'POST'
});

export const lagBliBeslutterFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/beslutter/bliBeslutter?vedtakId=${params.vedtakId}`,
	method: 'POST'
});

export const lagGodkjennVedtakFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/beslutter/godkjenn?vedtakId=${params.vedtakId}`,
	method: 'POST'
});

export const lagOppdaterBeslutterProsessStatusFetchInfo = (params: VedtakIdFetchParams): FetchInfo => ({
	credentials,
	url: `${VEILARBVEDTAKSSTOTTE_API}/beslutter/status?vedtakId=${params.vedtakId}`,
	method: 'PUT'
});
