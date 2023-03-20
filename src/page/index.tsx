import { HashRouter, Route, Routes } from 'react-router-dom';

import { MainNavigator } from '../component/MainNavigator';
import EntryPage from './Entry';
import HomePage from './Home';

export const PageFrame = () => (
    <>
        <MainNavigator />

        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/entry/:title" element={<EntryPage />} />
            </Routes>
        </HashRouter>
    </>
);
