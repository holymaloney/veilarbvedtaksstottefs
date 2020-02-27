import React from 'react';
import { TidligereVedtak } from '../../components/tidligere-vedtak/tidligere-vedtak';
import { UtkastPanel } from '../../components/panel/utkast/utkast-panel';
import { GjeldendeVedtakPanel } from '../../components/panel/gjeldende-vedtak/gjeldende-vedtak-panel';
import { NyttVedtakPanel } from '../../components/panel/nytt-vedtak/nytt-vedtak-panel';
import Page from '../page/page';
import { useFetchStore } from '../../stores/fetch-store';
import { IngenTidligereVedtakPanel } from '../../components/panel/ingen-tidligere-vedtak/ingen-tidligere-vedtak-panel';
import { IngenGjeldendeVedtakPanel } from '../../components/panel/ingen-gjeldende-vedtak/ingen-gjeldende-vedtak';
import Show from '../../components/show';
import { Vedtak } from '../../rest/data/vedtak';
import './hovedside.less';

export function Hovedside() {
	const { vedtak, arenaVedtak, oppfolgingData } = useFetchStore();
	const underOppfolging = oppfolgingData.data.underOppfolging;

	const utkast = vedtak.data.find(v => v.vedtakStatus === 'UTKAST');
	const gjeldendeVedtak = vedtak.data.find(v => v.gjeldende) || arenaVedtak.data.find(v => v.erGjeldende);

	const tidligereVedtakFraModia = vedtak.data.filter(v => !v.gjeldende && v.vedtakStatus === 'SENDT');
	const tidligereVedtakFraArena = arenaVedtak.data.filter(v => !v.erGjeldende);
	const harTidligereVedtak = tidligereVedtakFraModia.length > 0 || tidligereVedtakFraArena.length > 0;

	return (
		<Page>
			<div className="hovedside">
				<div className="hovedside__vedtak-paneler">
					<Show if={!underOppfolging}>
						<IngenGjeldendeVedtakPanel />
					</Show>
					<Show if={underOppfolging}>
						<UtkastPanel utkast={utkast} />
						<Show if={gjeldendeVedtak != null}>
							<GjeldendeVedtakPanel gjeldendeVedtak={gjeldendeVedtak as Vedtak} />
						</Show>
						<NyttVedtakPanel utkast={utkast} />
					</Show>
				</div>
				<div className="hovedside__tidligere-vedtak-panel">
						{harTidligereVedtak
							? <TidligereVedtak modiaHistorikk={tidligereVedtakFraModia} arenaHistorikk={tidligereVedtakFraArena} />
							: <IngenTidligereVedtakPanel />
						}
				</div>
			</div>
		</Page>
	);
}
