import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

export interface AddressLocation extends Location {
    address: Record<'ISO3166-2-lvl4' | 'country_code' | 'country', string> &
        Partial<
            Record<
                | 'state'
                | 'state_district'
                | 'town'
                | 'village'
                | 'road'
                | 'neighbourhood'
                | 'building'
                | 'house_number'
                | 'amenity'
                | 'postcode',
                string
            >
        >;
}

export class MapModel extends BaseModel {
    nominatimClient = new HTTPClient({
        baseURI: 'https://nominatim.openstreetmap.org',
        responseType: 'json'
    });

    @observable
    currentCoord?: [number, number];

    @observable
    currentAddress?: AddressLocation;

    @toggle('downloading')
    async getCoord() {
        const {
            coords: { latitude, longitude }
        } = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        return (this.currentCoord = [latitude, longitude]);
    }

    /**
     * @see https://nominatim.org/release-docs/develop/api/Reverse/
     */
    @toggle('downloading')
    async getAddress(lat: number, lon: number) {
        const { body } = await this.nominatimClient.get<AddressLocation>(
            `reverse?${buildURLData({ lat, lon, format: 'json' })}`
        );
        return (this.currentAddress = body);
    }

    textOf({
        address: {
            country,
            state,
            state_district,
            town,
            village,
            road,
            neighbourhood,
            building,
            house_number,
            amenity
        }
    }: AddressLocation) {
        return [
            country,
            state,
            state_district,
            town,
            village,
            road,
            neighbourhood,
            building,
            house_number,
            amenity
        ]
            .filter(Boolean)
            .join(' ');
    }
}

export default new MapModel();
