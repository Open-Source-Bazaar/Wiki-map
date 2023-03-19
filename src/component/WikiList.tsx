import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { Card } from 'react-bootstrap';

import { i18n } from '../model/Translation';
import { WikiModel, WikiPage, WikiPageFilter } from '../model/Wiki';

export interface WikiListProps extends ScrollListProps<WikiPage> {
    filter: WikiPageFilter;
}

@observer
export class WikiList extends ScrollList<WikiListProps> {
    translator = i18n;
    store = new WikiModel();
    filter = this.props.filter;

    constructor(props: WikiListProps) {
        super(props);

        this.boot();
    }

    renderItem = ({ title, snippet, wordcount, timestamp }: WikiPage) => (
        <Card as="li" className="my-3" key={title}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text
                    dangerouslySetInnerHTML={{
                        __html: snippet
                    }}
                />
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
                <span>📜 {wordcount}</span>
                <time dateTime={timestamp}>
                    📅 {new Date(timestamp).toLocaleString()}
                </time>
            </Card.Footer>
        </Card>
    );

    renderList() {
        const { downloading, allItems } = this.store;

        return (
            <>
                {downloading > 0 && <Loading />}

                <ol className="list-unstyled m-0">
                    {allItems.map(this.renderItem)}
                </ol>
            </>
        );
    }
}
