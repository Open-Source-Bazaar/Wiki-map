import { OpenMap } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';

import mapStore from '../model/Map';

@observer
export class AutoMap extends PureComponent {
    async componentDidMount() {
        mapStore.getAddress(...(await mapStore.getCoord()));
    }

    render() {
        const { currentCoord, currentAddress } = mapStore;

        return currentCoord && currentAddress ? (
            <OpenMap
                center={currentCoord}
                zoom={18}
                markers={[
                    {
                        position: currentCoord,
                        tooltip: mapStore.textOf(currentAddress)
                    }
                ]}
            />
        ) : null;
    }
}
