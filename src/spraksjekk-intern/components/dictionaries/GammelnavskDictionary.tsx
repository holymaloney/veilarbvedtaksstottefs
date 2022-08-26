import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import { ExternalLink } from '@navikt/ds-icons';
import { GammelnavskOrdliste } from '../../data';
import { Kansellisten } from '../../data';

interface GammelnavskType {
	id: string;
	ord: string;
	gammelnavsk: string;
	klart_språk: string;
}

interface KansellistenType {
	kanselliord: string;
	alternativ_1: string;
	alternativ_2: string;
}

function GammelnavskDictionary(props: { content: string }) {
	let gammelnavskResultater: GammelnavskType[] = [];
	let kansellistenResultater: KansellistenType[] = [];

	if (props.content !== '') {
		gammelnavskResultater = GammelnavskOrdliste.gammelnavsk_ordliste.filter(gammelnavsk => {
			return props.content.toLowerCase().match('\\b' + gammelnavsk.ord.toLowerCase() + '\\b');
		});

		console.log(gammelnavskResultater);

		kansellistenResultater = Kansellisten.kansellisten.filter(gammelnavsk => {
			return props.content.toLowerCase().match('\\b' + gammelnavsk.kanselliord.toLowerCase() + '\\b');
		});
	}

	return (
		<>
			{(gammelnavskResultater.length > 0 || kansellistenResultater.length > 0) && (
				<Accordion.Item>
					<Accordion.Header type="button">
						{gammelnavskResultater.length + kansellistenResultater.length} ord som kan byttes ut
					</Accordion.Header>
					<Accordion.Content>
						<Heading level="3" size="xsmall">
							Velg enkle ord
						</Heading>
						<BodyShort className="mb-4">
							Ord og utrykk som sier noe på en vanskeligere måte enn nødvendig:
						</BodyShort>

						{gammelnavskResultater.length >= 1 && (
							<>
								{gammelnavskResultater.map((gammelnavsk, i) => (
									<Accordion.Item key={'gammelnavsk' + i}>
										<Accordion.Header className="gammelnavskAccordion" type="button">
											<span className="firstLetter">"{gammelnavsk.ord}"</span>
										</Accordion.Header>
										<Accordion.Content className="gammelnavskAccordionContent">
											<Heading level="4" size="xsmall">
												Gammelnavsk
											</Heading>
											<BodyShort>{gammelnavsk.gammelnavsk}</BodyShort>
											<Heading className="mt-4" level="4" size="xsmall">
												Klart språk
											</Heading>
											{gammelnavsk.klart_språk}
											<Heading className="mt-4" level="4" size="xsmall">
												Kilde
											</Heading>
											<Link
												target="_blank"
												href="https://github.com/navikt/ordlister/blob/main/gammelnavsk/gammelnavsk_ordliste_2utgave.pdf"
											>
												Gammelnavsk ordliste
												<ExternalLink />
											</Link>
										</Accordion.Content>
									</Accordion.Item>
								))}
							</>
						)}

						{kansellistenResultater.length >= 1 && (
							<Accordion className="gammelnavskAccordion">
								{kansellistenResultater.map((kanselli, i) => (
									<Accordion.Item key={'kanselli' + i}>
										<Accordion.Header className="gammelnavskAccordion" type="button">
											<span className="firstLetter">"{kanselli.kanselliord}"</span>
										</Accordion.Header>
										<Accordion.Content className="gammelnavskAccordionContent">
											<Heading level="4" size="xsmall">
												Forslag
											</Heading>
											Skriv heller: {kanselli.alternativ_1}
											<Heading className="mt-4" level="4" size="xsmall">
												Kilde
											</Heading>
											<Link
												target="_blank"
												href="https://www.sprakradet.no/klarsprak/om-skriving/kansellisten/"
											>
												Kansellisten
												<ExternalLink />
											</Link>
										</Accordion.Content>
									</Accordion.Item>
								))}
							</Accordion>
						)}
					</Accordion.Content>
				</Accordion.Item>
			)}
		</>
	);
}

export default GammelnavskDictionary;
