import { Loading, OpenMap, OpenMapProps } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';

import mapStore, { AddressLocation, MapModel } from '../model/Map';

export interface AutoMapProps extends OpenMapProps {
    onLoad?: (
        coordinate: MapModel['currentCoord'],
        address: AddressLocation,
        addressText: string
    ) => any;
}

@observer
export class AutoMap extends PureComponent<AutoMapProps> {
    async componentDidMount() {
        await mapStore.getAddress(...(await mapStore.getCoord()));

        this.props.onLoad?.(
            mapStore.currentCoord,
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
                {...this.props}
            />
        ) : (
            <Loading />
        );
    }
}
