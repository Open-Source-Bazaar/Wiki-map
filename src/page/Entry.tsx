import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-class-tools';

import { i18n } from '../model/Translation';
import wikiStore from '../model/Wiki';

@observer
class EntryPage extends PureComponent<RouteComponentProps<{ title: string }>> {
    componentDidMount() {
        const { title } = this.props.match.params;

        wikiStore.getOne(title);
    }

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Styling_content}
     */
    render() {
        const { title } = this.props.match.params,
            { text } = wikiStore.currentOne,
            { currentLanguage } = i18n;
        const [language] = currentLanguage.split('-');

        return (
            <Container>
                <link
                    rel="stylesheet"
                    href={`//${language}.wikipedia.org/w/load.php?debug=false&lang=${language}&modules=mediawiki.legacy.commonPrint,shared|skins.vector.styles&only=styles&skin=vector&*`}
                />
                <h1>{title}</h1>

                <article
                    className="py-3"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </Container>
        );
    }
}

export default withRouter(EntryPage);
