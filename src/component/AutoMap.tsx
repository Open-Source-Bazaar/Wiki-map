import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import {
    AddressLocation,
    OpenReactMap,
    OpenReactMapModel,
    OpenReactMapProps
} from 'open-react-map';
import { Component } from 'react';

export interface AutoMapProps extends OpenReactMapProps {
    onLoad?: (
        coordinate: OpenReactMapModel['currentLocation'],
        address: AddressLocation,
        addressText: string
    ) => any;
}

@observer
export class AutoMap extends Component<AutoMapProps> {
    mapStore = new OpenReactMapModel();

    async componentDidMount() {
        const { mapStore } = this;

        await mapStore.reverse(...(await mapStore.locate()));

        this.props.onLoad?.(
            mapStore.currentLocation,
            mapStore.reversedAddress,
            mapStore.reversedAddressText
        );
    }

    render() {
        const { currentLocation, reversedAddressText } = this.mapStore;

        return currentLocation && reversedAddressText ? (
            <OpenReactMap
                center={currentLocation}
                zoom={18}
                markers={[
                    {
                        position: currentLocation,
                        tooltip: reversedAddressText
                    }
                ]}
                {...this.props}
            />
        ) : (
            <Loading />
        );
    }
}
