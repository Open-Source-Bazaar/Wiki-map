import { observer } from 'mobx-react';
import { Container, Table } from 'react-bootstrap';
import { Editor } from 'react-bootstrap-editor';
import {
    TimeDistance,
    TableSpinner,
    Icon,
    Avatar,
    Nameplate,
    EditorHTML
} from 'idea-react';

import { TSXSample } from '../component/TSXSample';
import EditorJS from '../component/Editor';
import RichEditData from '../model/rich-edit.json';
import { i18n } from '../model/Translation';

Table.displayName = 'Table';

const { t } = i18n,
    content = JSON.stringify(RichEditData);

export const ComponentPage = observer(() => (
    <Container className="my-3" fluid="md">
        <h1>{t('component')}</h1>

        <TSXSample title="Time Distance">
            <TimeDistance date="1989-06-04" />
        </TSXSample>

        <TSXSample title="Icon">
            <Icon name="bootstrap" size={2} />
        </TSXSample>

        <TSXSample title="Avatar">
            <Avatar src="https://github.com/idea2app.png" />
        </TSXSample>

        <TSXSample title="Nameplate">
            <Nameplate
                avatar="https://github.com/idea2app.png"
                name="idea2app"
            />
        </TSXSample>

        <TSXSample title="Table spinner">
            <Table className="text-center" striped hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    <TableSpinner colSpan={2} />
                </tbody>
            </Table>
        </TSXSample>

        <TSXSample title="Rich-text editor (HTML)">
            <Editor defaultValue="<p>test</p>" onChange={console.log} />
        </TSXSample>

        <TSXSample title="Rich-text editor (JSON)">
            <EditorJS name="content" defaultValue={content} />
        </TSXSample>

        <TSXSample title="Editor HTML">
            <EditorHTML data={content} />
        </TSXSample>
    </Container>
));
