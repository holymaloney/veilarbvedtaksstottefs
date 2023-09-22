import TilgangTilBrukersKontor from '../util/type/tilgang-til-brukers-kontor';
import { AxiosPromise } from 'axios';
import { axiosInstance, axiosInstanceWithFnrInData } from './utils';

export default interface OppfolgingData {
	reservasjonKRR: boolean;
	underOppfolging: boolean;
	inaktivIArena: boolean;
}

export function fetchOppfolging(fnr: string): AxiosPromise<OppfolgingData> {
	return axiosInstanceWithFnrInData(fnr).post(`/veilarboppfolging/api/v2/oppfolging/v3`);
}

export function fetchTilgangTilBrukersKontor(fnr: string): AxiosPromise<TilgangTilBrukersKontor> {
	return axiosInstance.get(`/veilarboppfolging/api/oppfolging/veilederTilgang?fnr=${fnr}`);
}
