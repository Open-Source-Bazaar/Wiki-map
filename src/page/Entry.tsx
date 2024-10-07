import { SpeechSynthesisModel, SpeechSynthesisState } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Container } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-class-tools';

import { FloatIconButton } from '../component/IconButton';
import { i18n } from '../model/Translation';
import wikiStore, { WikiPage } from '../model/Wiki';

@observer
class EntryPage extends Component<RouteComponentProps<{ title: string }>> {
    storeTTS = new SpeechSynthesisModel(i18n);

    componentDidMount() {
        const { title } = this.props.match.params;

        wikiStore.getOne(title);
    }

    componentWillUnmount() {
        wikiStore.clearCurrent();
        this.storeTTS.clear();
    }

    toggleVoice = () => {
        const { storeTTS } = this;

        if (storeTTS.state !== SpeechSynthesisState.Clear)
            return storeTTS.toggle();

        const text = SpeechSynthesisModel.getReadableText(
            document.querySelector('article')
        );
        storeTTS.speak(text);
    };

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Styling_content}
     */
    render() {
        const { title } = this.props.match.params,
            { fullurl, text } = wikiStore.currentOne as WikiPage,
            speaking = this.storeTTS.state === SpeechSynthesisState.Speaking,
            { currentLanguage } = i18n;
        const [language] = currentLanguage?.split('-') || [];

        return (
            <Container>
                <link
                    rel="stylesheet"
                    href={`//${language}.wikipedia.org/w/load.php?debug=false&lang=${language}&modules=mediawiki.legacy.commonPrint,shared|skins.vector.styles&only=styles&skin=vector&*`}
                />
                <h1>
                    <a target="_blank" href={fullurl}>
                        {title}
                    </a>
                </h1>

                <article
                    className="py-3"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
                <FloatIconButton
                    name={speaking ? 'pause-fill' : 'play-fill'}
                    onClick={this.toggleVoice}
                />
            </Container>
        );
    }
}

export default withRouter(EntryPage);
