import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import '../style.css'
import DrawArea from './DrawArea'
import Join from './Join'




export default function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <Join />
                    </Route>
                    <Route exact path="/room">
                        <DrawArea />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}