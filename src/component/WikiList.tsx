import { FC } from 'react';
import { Card } from 'react-bootstrap';

import { WikiBasePage, WikiSearchPage } from '../model/Wiki';

export const WikiCard: FC<WikiBasePage> = page => (
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
                        __html: (page as WikiSearchPage).snippet
                    }}
                />
            )}
        </Card.Body>

        {'wordcount' in page && (
            <Card.Footer className="d-flex justify-content-between align-items-center">
                <span>📜 {(page as WikiSearchPage).wordcount}</span>
                <time dateTime={(page as WikiSearchPage).timestamp}>
                    📅{' '}
                    {new Date(
                        (page as WikiSearchPage).timestamp
                    ).toLocaleString()}
                </time>
            </Card.Footer>
        )}
    </Card>
);
