import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';

import { AutoMap } from '../component/AutoMap';
import { FloatIconButton } from '../component/IconButton';
import { WikiList } from '../component/WikiList';
import { MapModel } from '../model/Map';
import { i18n } from '../model/Translation';

const { t } = i18n;

@observer
export class HomePage extends PureComponent {
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
                <FloatIconButton name="arrow-clockwise" href="/" />
            </main>
        );
    }
}
