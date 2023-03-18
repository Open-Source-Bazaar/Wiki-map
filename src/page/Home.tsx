import { PureComponent } from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-class-tools';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';

import project, { Project } from '../model/Project';
import { i18n } from '../model/Translation';

const { t } = i18n;

@observer
class HomePage extends PureComponent<
    RouteComponentProps<{}, {}, { guest: string }>
> {
    componentDidMount() {
        project.getList(
            'facebook/react',
            'microsoft/TypeScript',
            'mobxjs/mobx',
            'react-bootstrap/react-bootstrap',
            'EasyWebApp/KoAJAX'
        );
    }

    componentWillUnmount() {
        project.clearList();
    }

    renderProject = ({
        id,
        name,
        logo,
        description,
        homepage,
        html_url
    }: Project) => (
        <Col className="mb-3" xs={12} sm={6} md={3} key={id}>
            <Card className="h-100">
                <Card.Img variant="top" src={logo} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                    <Button
                        variant="primary"
                        size="sm"
                        target="_blank"
                        href={homepage}
                    >
                        {t('home_page')}
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        target="_blank"
                        href={html_url}
                    >
                        {t('source_code')}
                    </Button>
                </Card.Footer>
            </Card>
        </Col>
    );

    render() {
        const { guest } = this.props.query,
            { list } = project;

        return (
            <Container fluid="md">
                <h1 className="my-4">{t('upstream_projects')}</h1>

                {guest && (
                    <h2>
                        {t('welcome')} {guest}!
                    </h2>
                )}
                <Row>{list.map(this.renderProject)}</Row>
            </Container>
        );
    }
}

export default withRouter(HomePage);
