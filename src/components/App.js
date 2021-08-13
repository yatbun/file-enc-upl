import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import { StoreProvider } from "../contexts/StoreContext";
import Home from "./Home";
import FileLink from "./FileLink";
import GetFile from "./GetFile";

function App() {
    return (
        <Container>
            <Router>
                <StoreProvider>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path={`/link/:id`} component={FileLink} />
                        <Route exact path={`/file/:id`} component={GetFile} />
                    </Switch>
                </StoreProvider>
            </Router>
        </Container>
    );
}

export default App;
