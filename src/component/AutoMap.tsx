import { OpenMap } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';

import mapStore, { AddressLocation } from '../model/Map';

export interface AutoMapProps {
    onLoad?: (address: AddressLocation, addressText: string) => any;
}

@observer
export class AutoMap extends PureComponent<AutoMapProps> {
    async componentDidMount() {
        await mapStore.getAddress(...(await mapStore.getCoord()));

        this.props.onLoad?.(
            mapStore.currentAddress,
            mapStore.currentAddressText
        );
    }

    render() {
        const { currentCoord, currentAddressText } = mapStore;

        return currentCoord && currentAddressText ? (
            <OpenMap
                center={currentCoord}
                zoom={18}
                markers={[
                    {
                        position: currentCoord,
                        tooltip: currentAddressText
                    }
                ]}
            />
        ) : null;
    }
}
