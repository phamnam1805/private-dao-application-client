import { Redirect, Route, Switch } from "react-router-dom";
import CreateDAO from "src/pages/CreateDAO";
import DAODetails from "src/pages/DAODetails";
import ProposalList from "src/pages/DAODetails/ProposalList";
import DAOList from "src/pages/DAOList";
import Dashboard from "src/pages/Investment/Dashboard";
import Portfolio from "src/pages/Investment/Portfolio";
import Keygen from "src/pages/DKGCommittee/Keygen";
import Request from "src/pages/DKGCommittee/Request";

const RouteConfig = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return <Component {...props} />;
    }}
  />
);

export default function RouteApp() {
  return (
    <Switch>
      <RouteConfig path="/daos/:daoAddress" component={DAODetails} />
      <RouteConfig path="/daos" component={DAOList} />
      <RouteConfig path="/create-dao" component={CreateDAO} />
      <RouteConfig path="/proposals/:daoAddress" component={ProposalList} />

      <RouteConfig path="/investment-dashboard" component={Dashboard} />
      <RouteConfig path="/investment-portfolio" component={Portfolio} />
      <Route path="/investments">
        <Redirect to="/investment-dashboard" />
      </Route>

      <RouteConfig path="/contribution-keygen" component={Keygen} />
      <RouteConfig path="/contribution-request" component={Request} />
      <Route path="/committee">
        <Redirect to="/contribution-keygen" />
      </Route>

      <Route path="/">
        <Redirect to="/daos" />
      </Route>
    </Switch>
  );
}
