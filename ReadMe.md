![](src/image/logo.png)

# React-MobX-Bootstrap.ts

[React][1] project scaffold based on [TypeScript][2], [MobX][3] & [Bootstrap][4],
which is inspired by [WebCell scaffold][5].

[![CI & CD](https://github.com/idea2app/React-MobX-Bootstrap-ts/workflows/CI%20&%20CD/badge.svg)][7]

## Technology stack

-   Language: [TypeScript v4][2]
-   Component engine: [React 17][1]
-   State management: [MobX v5][3]
-   Component suite: [React Bootstrap v2][8]
-   HTTP Client: [KoAJAX][9]
-   PWA framework: [Workbox v6][10]
-   Package bundler: [Parcel v2][11]
-   CI / CD: GitHub [Actions][12] + [Pages][13]

## Extra components

1. [Component Sample](src/component/TSXSample.tsx)
2. Rich-text editor
    - [HTML version][14]
    - [JSON version](src/component/Editor.tsx)

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

[1]: https://reactjs.org/
[2]: https://www.typescriptlang.org/
[3]: https://mobx.js.org/
[4]: https://getbootstrap.com/
[5]: https://github.com/EasyWebApp/scaffold
[7]: https://github.com/idea2app/React-MobX-Bootstrap-ts/actions
[8]: https://react-bootstrap.github.io/
[9]: https://github.com/EasyWebApp/KoAJAX
[10]: https://developers.google.com/web/tools/workbox
[11]: https://parceljs.org
[12]: https://github.com/features/actions
[13]: https://pages.github.com/
[14]: https://github.com/idea2app/React-Bootstrap-editor
