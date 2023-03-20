import { HTTPClient } from 'koajax';
import { autorun } from 'mobx';
import { DataObject, Filter, ListModel, Stream, toggle } from 'mobx-restful';
import { buildURLData, parseDOM, stringifyDOM } from 'web-utility';

import { i18n } from './Translation';

export interface WikiBasePage extends Record<'ns' | 'pageid', number> {
    title: string;
    text?: string;
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

interface WikiPageData {
    parse: Pick<WikiBasePage, 'pageid' | 'title'> & {
        text: Record<string, string>;
    };
}

export class WikiModel extends Stream<WikiBasePage, WikiPageFilter>(ListModel) {
    client = new HTTPClient({ responseType: 'json' });

    commonRequestData = { origin: '*', format: 'json' };

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
                ...this.commonRequestData,
                action: 'query',
                generator: 'geosearch',
                prop: 'coordinates|pageimages',
                ggscoord: coordinate.join('|')
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
                    ...this.commonRequestData,
                    action: 'query',
                    list: 'search',
                    srsearch: keywords,
                    sroffset: i,
                    srlimit: this.pageSize
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

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page#Method_2:_Use_the_Parse_API}
     */
    @toggle('downloading')
    async getOne(title: string) {
        const { body } = await this.client.get<WikiPageData>(
            `api.php?${buildURLData({
                ...this.commonRequestData,
                action: 'parse',
                page: title,
                prop: 'text'
            })}`
        );
        const { text, ...page } = body.parse,
            fragment = document.createDocumentFragment();

        fragment.append(...parseDOM(Object.values(text)[0]));

        fragment.querySelector('.infobox')?.remove();

        const reference = fragment.querySelector('.reflist');

        reference?.previousElementSibling.remove();
        reference?.remove();

        [...fragment.querySelectorAll('.navbox')].slice(-1)[0]?.remove();

        for (const editor of fragment.querySelectorAll(
            '.sistersitebox, .mw-editsection'
        ))
            editor.remove();

        return (this.currentOne = {
            ns: 0,
            ...page,
            text: stringifyDOM(fragment)
        });
    }
}

export default new WikiModel();
