import { HTTPClient } from 'koajax';
import { autorun } from 'mobx';
import { Filter, ListModel, Stream } from 'mobx-restful';
import { buildURLData, mergeStream } from 'web-utility';

import { i18n } from './Translation';

export type WikiPage = Record<'ns' | 'pageid' | 'size' | 'wordcount', number> &
    Record<'title' | 'snippet' | 'timestamp', string>;

export interface WikiPageFilter extends Filter<WikiPage> {
    keywords?: string;
}

interface WikiPageSearchList {
    batchcomplete: string;
    continue: {
        sroffset: number;
        continue: string;
    };
    query: {
        searchinfo: { totalhits: number };
        search: WikiPage[];
    };
}

export class WikiModel extends Stream<WikiPage, WikiPageFilter>(ListModel) {
    client = new HTTPClient({ responseType: 'json' });

    constructor() {
        super();

        autorun(
            () =>
                (this.client.baseURI = `https://${
                    i18n.currentLanguage.split('-')[0]
                }.wikipedia.org/w/`)
        );
    }

    openStream({ keywords }: WikiPageFilter) {
        return mergeStream(
            async function* (this: WikiModel) {
                for (let i = 0; ; i += this.pageSize) {
                    const { body } = await this.client.get<WikiPageSearchList>(
                        `api.php?${buildURLData({
                            action: 'query',
                            list: 'search',
                            srsearch: keywords,
                            sroffset: i,
                            srlimit: this.pageSize,
                            origin: '*',
                            format: 'json'
                        })}`
                    );
                    const { searchinfo, search } = body.query;

                    this.totalCount = searchinfo.totalhits;

                    if (!search[0]) break;

                    yield* search;
                }
            }.bind(this)
        );
    }
}

export default new WikiModel();
