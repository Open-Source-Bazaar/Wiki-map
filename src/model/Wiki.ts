import { HTTPClient } from 'koajax';
import { autorun, when } from 'mobx';
import { DataObject, Filter, ListModel, Stream, toggle } from 'mobx-restful';
import { OpenReactMapModel } from 'open-react-map';
import { buildURLData, parseDOM, stringifyDOM } from 'web-utility';

import { i18n } from './Translation';

export interface WikiBasePage extends Record<'ns' | 'pageid', number> {
    title: string;
    text?: string;
}

export interface WikiPage
    extends WikiBasePage,
        Record<'lastrevid' | 'length', number>,
        Record<'touched' | 'fullurl' | 'editurl' | 'canonicalurl', string>,
        Record<'pagelanguage' | 'pagelanguagehtmlcode', 'en'> {
    contentmodel: 'wikitext';
    pagelanguagedir: 'ltr';
}

export type WikiSearchPage = WikiBasePage &
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
    coordinate?: OpenReactMapModel['currentLocation'];
}

interface WikiQueryData<T extends DataObject> {
    batchcomplete: string;
    query?: T;
}
type WikiPageQueryData<T extends WikiBasePage> = WikiQueryData<{
    pages: Record<string, T>;
}>;
type WikiPageInfo = WikiPageQueryData<WikiPage>;
type WikiPageGeoSearchList = WikiPageQueryData<WikiGeoPage>;

interface WikiPageSearchList
    extends WikiQueryData<{
        searchinfo: { totalhits: number };
        search: WikiSearchPage[];
    }> {
    continue: {
        sroffset: number;
        continue: string;
    };
}

interface WikiPageContent {
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
                    i18n.currentLanguage?.split('-')[0] || 'en'
                }.wikipedia.org/w/`)
        );
    }

    async *openStream({ keywords, coordinate }: WikiPageFilter) {
        if (coordinate) yield* this.searchGeo(coordinate);

        if (keywords) yield* this.searchText(keywords);
    }

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Search#GET_request}
     * @todo {@link https://wikilocation.org/}
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

    simplifyHTML(text: string) {
        const fragment = document.createDocumentFragment();

        fragment.append(...parseDOM(text));

        fragment.querySelector('.infobox')?.remove();

        const reference = fragment.querySelector('.reflist, .references');

        reference?.previousElementSibling?.remove();
        reference?.remove();

        [...fragment.querySelectorAll('.navbox')].slice(-1)[0]?.remove();

        for (const editor of fragment.querySelectorAll(
            '.sistersitebox, .ambox, sup.reference, .mw-editsection'
        ))
            editor.remove();

        return stringifyDOM(fragment);
    }

    /**
     * @see {@link https://www.mediawiki.org/wiki/API:Info#GET_request}
     * @see {@link https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page#Method_2:_Use_the_Parse_API}
     */
    @toggle('downloading')
    async getOne(title: string): Promise<WikiPage> {
        await when(() => !!i18n.currentLanguage);

        const {
            body: {
                query: { pages }
            }
        } = await this.client.get<WikiPageInfo>(
            `api.php?${buildURLData({
                ...this.commonRequestData,
                action: 'query',
                titles: title,
                prop: 'info',
                inprop: 'url'
            })}`
        );

        const {
            body: {
                parse: { text }
            }
        } = await this.client.get<WikiPageContent>(
            `api.php?${buildURLData({
                ...this.commonRequestData,
                action: 'parse',
                page: title,
                prop: 'text'
            })}`
        );

        return (this.currentOne = {
            ...Object.values(pages)[0],
            text: this.simplifyHTML(Object.values(text)[0])
        });
    }
}

export default new WikiModel();
