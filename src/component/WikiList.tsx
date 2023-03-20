import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { Card } from 'react-bootstrap';

import { i18n } from '../model/Translation';
import {
    WikiBasePage,
    WikiModel,
    WikiPage,
    WikiPageFilter
} from '../model/Wiki';

export interface WikiListProps extends ScrollListProps<WikiBasePage> {
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

    renderItem = (page: WikiBasePage) => (
        <Card as="li" className="my-3" key={page.title}>
            <Card.Body>
                <Card.Title
                    as="a"
                    className="text-decoration-none stretched-link"
                    href={`#/entry/${page.title}`}
                >
                    {page.title}
                </Card.Title>

                {'snippet' in page && (
                    <Card.Text
                        dangerouslySetInnerHTML={{
                            __html: (page as WikiPage).snippet
                        }}
                    />
                )}
            </Card.Body>

            {'wordcount' in page && (
                <Card.Footer className="d-flex justify-content-between align-items-center">
                    <span>📜 {(page as WikiPage).wordcount}</span>
                    <time dateTime={(page as WikiPage).timestamp}>
                        📅{' '}
                        {new Date(
                            (page as WikiPage).timestamp
                        ).toLocaleString()}
                    </time>
                </Card.Footer>
            )}
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
