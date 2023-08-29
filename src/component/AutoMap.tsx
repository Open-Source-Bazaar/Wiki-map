import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { OpenReactMap, OpenReactMapProps } from 'open-react-map';
import { PureComponent } from 'react';

import mapStore, { AddressLocation, MapModel } from '../model/Map';

export interface AutoMapProps extends OpenReactMapProps {
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
            <OpenReactMap
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
