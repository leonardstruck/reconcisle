import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Button, Card, Heading, Text, ChevronRightIcon } from 'evergreen-ui';
import icon from '../assets/icon.svg';
import './App.global.css';
import Open from './components/Open/Open';

const Hello = () => {
  return (
    <Card border="default" padding={50} background="tint1" elevation={4} justifyContent="center">
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <Heading textAlign="center" size={900} margin={10}>reconcIsle</Heading>
      <Text>A OpenRefine reconciliation service with a simple GUI</Text>
      <div className="Hello">
        <Link to="/open">
          <Button background="tint1" height={40} appearance="minimal" iconAfter={ChevronRightIcon}>Start</Button>
        </Link>
      </div>
    </Card>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/open" component={Open} />
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
