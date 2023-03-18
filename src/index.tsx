import { auto } from 'browser-unhandled-rejection';
import { serviceWorkerUpdate } from 'web-utility';
import { render } from 'react-dom';

import { PageFrame } from './page';

auto();

self.addEventListener('unhandledrejection', ({ reason }) => {
    const { message } = reason as Error;

    if (message) self.alert(message);
});

const { serviceWorker } = window.navigator,
    { NODE_ENV = 'development' } = process.env;

if (NODE_ENV !== 'development')
    serviceWorker
        ?.register('sw.js')
        .then(serviceWorkerUpdate)
        .then(worker => {
            if (
                window.confirm(
                    'New version of this Web App detected, update now?'
                )
            )
                worker.postMessage({ type: 'SKIP_WAITING' });
        });

serviceWorker?.addEventListener('controllerchange', () =>
    window.location.reload()
);

render(<PageFrame />, document.querySelector('#app'));
