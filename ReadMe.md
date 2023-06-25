# Wiki map

Wiki map [PWA][4] with [Text-to-Speak][5] support, which is based on [OpenStreetMap][14] & [Wikipedia API][15], and can be used as a **trusted Tour guide**.

[![CI & CD](https://github.com/Open-Source-Bazaar/Wiki-map/actions/workflows/main.yml/badge.svg)][7]

## Technology stack

-   Language: [TypeScript v5][2]
-   Component engine: [React 17][1]
-   State management: [MobX v5][3]
-   Component suite: [React Bootstrap v2][8]
-   HTTP Client: [KoAJAX][9]
-   PWA framework: [Workbox v7][10]
-   Package bundler: [Parcel v2][11]
-   CI / CD: GitHub [Actions][12] + [Pages][13]

## Development

```shell
npm i pnpm -g

pnpm i

npm start
```

## Deployment

```shell
pnpm build
```

## Inspired by

1. https://en.wikipedia.org/wiki/Special:Nearby
2. https://www.producthunt.com/products/wiki-map
3. https://www.osmand.net/docs/user/plugins/wikipedia
4. https://nearbywiki.org/
5. https://wiki-map.com/
6. https://github.com/super8989/WikiMap
7. https://github.com/corrinachow/wiki-maps

[1]: https://reactjs.org/
[2]: https://www.typescriptlang.org/
[3]: https://mobx.js.org/
[4]: https://web.dev/progressive-web-apps/
[5]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
[7]: https://github.com/Open-Source-Bazaar/Wiki-map/actions/workflows/main.yml
[8]: https://react-bootstrap.github.io/
[9]: https://github.com/EasyWebApp/KoAJAX
[10]: https://developers.google.com/web/tools/workbox
[11]: https://parceljs.org
[12]: https://github.com/features/actions
[13]: https://pages.github.com/
[14]: https://www.openstreetmap.org/
[15]: https://www.mediawiki.org/wiki/API:Main_page
