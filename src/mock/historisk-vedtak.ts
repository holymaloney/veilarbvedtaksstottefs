import  { InnsatsgruppeType } from '../components/skjema/innsatsgruppe/innsatsgruppe';
import { HovedmalType } from '../components/skjema/hovedmal/hovedmal';
import { VedtakData } from '../utils/types/vedtak';

const historisk: VedtakData[] = [
    {
        id: 2,
        hovedmal: HovedmalType.BEHOLDE_ARBEID,
        andreopplysninger: [],
        innsatsgruppe: InnsatsgruppeType.STANDARD_INNSATS,
        vedtakStatus: 'SENDT',
        sistOppdatert: '2019-04-03T12:58:43.716393+02:00',
        begrunnelse: 'herps derps herps',
        opplysninger: {},
        gjeldende: false,
        veilederEnhetId: 'Gotham City',
        veilederIdent: 'Z007',
    },
    {
        id: 3,
        hovedmal: HovedmalType.SKAFFE_ARBEID,
        innsatsgruppe: InnsatsgruppeType.SITUASJONSBESTEMT_INNSATS,
        vedtakStatus: 'SENDT',
        opplysninger: {},
        sistOppdatert: '2018-08-05T09:55:43.716393+02:00',
        begrunnelse: 'herp derp',
        andreopplysninger: [],
        gjeldende: false,
        veilederEnhetId: 'Gotham City',
        veilederIdent: 'Z007'
    }
];

export default historisk;
