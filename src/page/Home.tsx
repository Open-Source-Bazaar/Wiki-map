import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { PureComponent } from 'react';

import { AutoMap } from '../component/AutoMap';
import { FloatIconButton } from '../component/IconButton';
import { MapModel } from '../model/Map';
import { i18n } from '../model/Translation';
import { WikiModel } from '../model/Wiki';
import { WikiCard } from '../component/WikiList';

@observer
export class HomePage extends PureComponent {
    store = new WikiModel();

    @observable
    keywords = '';

    @observable
    coordinate?: MapModel['currentCoord'];

    render() {
        const { store, keywords, coordinate } = this;

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
                        <ScrollList
                            translator={i18n}
                            store={store}
                            filter={{ keywords, coordinate }}
                            renderList={allItems => (
                                <ol className="list-unstyled m-0">
                                    {allItems.map(page => (
                                        <WikiCard key={page.pageid} {...page} />
                                    ))}
                                </ol>
                            )}
                        />
                    </div>
                )}
                <FloatIconButton name="arrow-clockwise" href="/" />
            </main>
        );
    }
}
