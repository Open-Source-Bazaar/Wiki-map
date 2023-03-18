import { PureComponent } from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-class-tools';

import { AutoMap } from '../component/AutoMap';
import { i18n } from '../model/Translation';

const { t } = i18n;

@observer
class HomePage extends PureComponent<
    RouteComponentProps<{}, {}, { guest: string }>
> {
    render() {
        return (
            <main style={{ height: 'calc(100vh - 3.7rem)' }}>
                <AutoMap />
            </main>
        );
    }
}

export default withRouter(HomePage);
