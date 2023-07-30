import AppHeader from "../appHeader/AppHeader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {lazy, Suspense} from "react";
import Spinner from "../spinner/Spinner";
import CharPage from "../pages/CharPage";

const Page404 = lazy(() => import('../pages/404'))
const MainPage = lazy(() => import('../pages/MainPage'))
const ComicsPage = lazy(() => import('../pages/ComicsPage'))
const SingleComicsPage = lazy(() => import('../pages/SingleComicsPage'))

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Switch>
                            <Route exact path={'/comics'}>
                                <ComicsPage/>
                            </Route>
                            <Route exact path={'/'}>
                                <MainPage/>
                            </Route>
                            <Route exact path={'/comics/:comicsId'}>
                                <SingleComicsPage/>
                            </Route>
                            <Route exact path={'/characters/:charId'}>
                                <CharPage/>
                            </Route>
                            <Route path={'*'}>
                                <Page404/>
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;