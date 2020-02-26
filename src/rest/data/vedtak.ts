import { OrNothing } from '../../utils/types/ornothing';

type VedtakStatus = 'UTKAST' | 'SENDT';

export type TidligereVedtakData = VedtakData | ArenaVedtakData;

export function erVedtakFraArena(tidligereVedtak: TidligereVedtakData): tidligereVedtak is ArenaVedtakData  {
	return (tidligereVedtak as VedtakData).id == null;
}

export enum InnsatsgruppeType {
	STANDARD_INNSATS = 'STANDARD_INNSATS',
	SITUASJONSBESTEMT_INNSATS = 'SITUASJONSBESTEMT_INNSATS',
	SPESIELT_TILPASSET_INNSATS = 'SPESIELT_TILPASSET_INNSATS',
	GRADERT_VARIG_TILPASSET_INNSATS = 'GRADERT_VARIG_TILPASSET_INNSATS',
	VARIG_TILPASSET_INNSATS = 'VARIG_TILPASSET_INNSATS'
}

export enum HovedmalType {
	SKAFFE_ARBEID = 'SKAFFE_ARBEID',
	BEHOLDE_ARBEID = 'BEHOLDE_ARBEID'
}

export interface VedtakData {
	id: number;
	hovedmal: OrNothing<HovedmalType>;
	innsatsgruppe: OrNothing<InnsatsgruppeType>;
	vedtakStatus: VedtakStatus;
	sistOppdatert: string;
	begrunnelse: OrNothing<string>;
	gjeldende: boolean;
	veilederIdent: string;
	veilederNavn: string;
	oppfolgingsenhetId: string;
	oppfolgingsenhetNavn: string;
	beslutterNavn: OrNothing<string>;
	sendtTilBeslutter: boolean;
	opplysninger: string[];
	journalpostId: OrNothing<string>;
	dokumentInfoId: OrNothing<string>;
}

export interface ArenaVedtakData {
	journalpostId: string;
	dokumentInfoId: string;
	veilederNavn: string;
	oppfolgingsenhetId: string;
	oppfolgingsenhetNavn: string;
	datoOpprettet: string;
	erGjeldende: boolean;
	innsatsgruppe: OrNothing<InnsatsgruppeType>;
}

