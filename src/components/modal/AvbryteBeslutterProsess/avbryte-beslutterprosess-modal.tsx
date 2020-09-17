import React, { useState } from 'react';
import { VarselIkonType, VarselModal } from '../varsel-modal/varsel-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { ModalProps } from '../modal-props';
import { ModalType, useModalStore } from '../../../stores/modal-store';
import { useViewStore } from '../../../stores/view-store';
import { useSkjemaStore } from '../../../stores/skjema-store';
import { useDataStore } from '../../../stores/data-store';
import { fetchAvbruttBeslutterProsess } from '../../../rest/api';
import { SystemMeldingType } from '../../../utils/types/melding-type';
import { erBeslutterProsessStartet, hentId } from '../../../utils';
import { InnsatsgruppeType } from '../../../rest/data/vedtak';
import { OrNothing } from '../../../utils/types/ornothing';

interface AvbrytBeslutterProsessModalProps extends ModalProps{
    Innsatsgruppe: OrNothing<InnsatsgruppeType>;
}

function AvbrytBeslutterProsessModal(props: AvbrytBeslutterProsessModalProps) {
    const { hideModal, showModal } = useModalStore();
    const { changeView } = useViewStore();
    const { utkast, setUtkast, leggTilSystemMelding, setUtkastBeslutter } = useDataStore();
    const { innsatsgruppe, setInnsatsgruppe, resetSkjema, beslutterProsessStatus, setBeslutterProsessStatus } = useSkjemaStore();
    const [dialogModalApen, setDialogModalApen] = useState(erBeslutterProsessStartet(beslutterProsessStatus));
    const [ laster, setLaster ] = useState(false);

    function handleOnJaClicked() {
        setLaster(true);
        fetchAvbruttBeslutterProsess(hentId(utkast))
            .then(() => {
                hideModal();
                setDialogModalApen(true);
                setInnsatsgruppe(props.Innsatsgruppe);
                setBeslutterProsessStatus(null);
                setUtkastBeslutter(null, null);
                leggTilSystemMelding(SystemMeldingType.BESLUTTER_PROSESS_AVBRUTT);
            })
            .catch(() => showModal(ModalType.FEIL_VED_AVBRYT_BESLUTTER_PROSESS))
            .finally(() => setLaster(false));
    }

    return (
        <VarselModal
            isOpen={props.isOpen}
            contentLabel="Avbryt Beslutter Prosessen"
            onRequestClose={hideModal}
            varselIkonType={VarselIkonType.ADVARSEL}
        >
            <Systemtittel className="blokk-xxxs">Endre innsatsgruppe</Systemtittel>
            <Normaltekst>Beslutterprosessen vil avbrytes. Er du sikker på at du vil endre innsatsgruppe?</Normaltekst>
            <div className="varsel-modal__knapper">
                <Hovedknapp onClick={handleOnJaClicked}>Ja</Hovedknapp>
                <Knapp onClick={hideModal}>Nei</Knapp>
            </div>
        </VarselModal>
    );
}

export default AvbrytBeslutterProsessModal;
