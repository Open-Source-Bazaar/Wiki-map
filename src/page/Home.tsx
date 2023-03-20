import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-class-tools';

import { AutoMap } from '../component/AutoMap';
import { WikiList } from '../component/WikiList';
import { MapModel } from '../model/Map';
import { i18n } from '../model/Translation';

const { t } = i18n;

@observer
class HomePage extends PureComponent<
    RouteComponentProps<{}, {}, { guest: string }>
> {
    @observable
    keywords = '';

    @observable
    coordinate?: MapModel['currentCoord'];

    render() {
        const { keywords, coordinate } = this;

        return (
            <main style={{ height: 'calc(100vh - 3.7rem)' }}>
                <AutoMap
                    className="h-50"
                    onLoad={(coordinate, {}, address) => {
                        this.keywords = address;
                        this.coordinate = coordinate;
                    }}
                />
                {keywords && coordinate && (
                    <div className="h-50 overflow-auto px-3 pb-3 bg-white">
                        <WikiList filter={{ keywords, coordinate }} />
                    </div>
                )}
            </main>
        );
    }
}

export default withRouter(HomePage);
