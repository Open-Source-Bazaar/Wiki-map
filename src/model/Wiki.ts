import { HTTPClient } from 'koajax';
import { autorun } from 'mobx';
import { DataObject, Filter, ListModel, Stream } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { i18n } from './Translation';

export interface WikiBasePage extends Record<'ns' | 'pageid', number> {
    title: string;
}

export type WikiPage = WikiBasePage &
    Record<'size' | 'wordcount', number> &
    Record<'snippet' | 'timestamp', string>;

export interface WikiCoordinate extends Record<'lat' | 'lon', number> {
    primary: string;
    globe: 'earth';
}

export interface WikiImage extends Record<'width' | 'height', number> {
    source: string;
}

export interface WikiGeoPage extends WikiBasePage {
    index: number;
    coordinates: WikiCoordinate[];
    thumbnail: WikiImage;
    pageimage: string;
}

export interface WikiPageFilter extends Filter<WikiBasePage> {
    keywords?: string;
    coordinate?: [number, number];
}

interface WikiQueryData<T extends DataObject> {
    batchcomplete: string;
    query?: T;
}

type WikiPageGeoSearchList = WikiQueryData<{
    pages: Record<string, WikiGeoPage>;
}>;

interface WikiPageSearchList
    extends WikiQueryData<{
        searchinfo: { totalhits: number };
        search: WikiPage[];
    }> {
    continue: {
        sroffset: number;
        continue: string;
    };
}

export class WikiModel extends Stream<WikiBasePage, WikiPageFilter>(ListModel) {
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

    async *openStream({ keywords, coordinate }: WikiPageFilter) {
        if (coordinate) yield* this.searchGeo(coordinate);

        if (keywords) yield* this.searchText(keywords);
    }

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Search#GET_request}
     */
    async *searchGeo(coordinate: WikiPageFilter['coordinate']) {
        const { body } = await this.client.get<WikiPageGeoSearchList>(
            `api.php?${buildURLData({
                action: 'query',
                generator: 'geosearch',
                prop: 'coordinates|pageimages',
                ggscoord: coordinate.join('|'),
                origin: '*',
                format: 'json'
            })}`
        );
        if (!body.query) {
            this.totalCount = 0;
            return;
        }
        const list = Object.values(body.query.pages);

        this.totalCount = list.length;

        yield* list;
    }

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Geosearch#Example_3:_Search_for_pages_nearby_with_images}
     */
    async *searchText(keywords: string) {
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
            if (!body.query) {
                this.totalCount = 0;
                return;
            }
            const { searchinfo, search } = body.query;

            if (i === 0)
                this.totalCount = (this.totalCount || 0) + searchinfo.totalhits;

            if (!search[0]) break;

            yield* search;
        }
    }
}

export default new WikiModel();
