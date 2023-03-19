import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-class-tools';

import { AutoMap } from '../component/AutoMap';
import { WikiList } from '../component/WikiList';
import { i18n } from '../model/Translation';

const { t } = i18n;

@observer
class HomePage extends PureComponent<
    RouteComponentProps<{}, {}, { guest: string }>
> {
    @observable
    keywords = '';

    render() {
        const { keywords } = this;

        return (
            <main
                className="position-relative"
                style={{ height: 'calc(100vh - 3.7rem)' }}
            >
                <AutoMap onLoad={({}, address) => (this.keywords = address)} />

                {keywords && (
                    <div className="fixed-bottom h-25 overflow-auto px-3 pb-3 bg-white">
                        <WikiList filter={{ keywords }} />
                    </div>
                )}
            </main>
        );
    }
}

export default withRouter(HomePage);
