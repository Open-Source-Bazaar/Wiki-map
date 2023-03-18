import { Select, Option } from 'idea-react';
import { observer } from 'mobx-react';
import { Navbar, Container, Nav } from 'react-bootstrap';

import { i18n, LanguageName } from '../model/Translation';
import * as style from './MainNavigator.module.less';

export const MainNavigator = observer(() => {
    const { t, currentLanguage } = i18n;

    return (
        <Navbar
            style={{ zIndex: 1030 }}
            bg="primary"
            variant="dark"
            sticky="top"
            expand="sm"
            collapseOnSelect
        >
            <Container>
                <Navbar.Brand href=".">
                    <img
                        className={`${style.logo} me-2`}
                        src="https://github.com/react-bootstrap.png"
                    />
                    {document.title}
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-inner" />

                <Navbar.Collapse id="navbar-inner">
                    <Nav className="me-auto">
                        <Nav.Link className="text-white" href="#/">
                            {t('home_page')}
                        </Nav.Link>
                        <Nav.Link className="text-white" href="#/component">
                            {t('component')}
                        </Nav.Link>
                        <Nav.Link className="text-white" href="#/pagination">
                            {t('pagination')}
                        </Nav.Link>
                        <Nav.Link
                            className="text-white"
                            href="https://github.com/idea2app/React-MobX-Bootstrap-ts"
                        >
                            {t('source_code')}
                        </Nav.Link>
                    </Nav>

                    <Select
                        value={currentLanguage}
                        onChange={key =>
                            i18n.changeLanguage(key as typeof currentLanguage)
                        }
                    >
                        {Object.entries(LanguageName).map(([key, name]) => (
                            <Option key={key} value={key}>
                                {name}
                            </Option>
                        ))}
                    </Select>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});
