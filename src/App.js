
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';

import { FormAnswers } from "./components/FormAnswers";
import { FormEditor } from "./components/FormEditor";
import { FormList } from "./components/FormList";
import { FormFiller } from "./components/FormFiller";
import { formExample, answersExample, formListExample } from './testData';

const Header = ({ selected }) => {
	return (
		<Layout.Header>
			<Menu mode="horizontal" theme="dark" defaultSelectedKeys={['1']} selectedKeys={selected}>
				<Menu.Item key="home">
					<Link to="/">Home</Link>
				</Menu.Item>
				<Menu.Item key="new">
					<Link to="/new">New Form</Link>
				</Menu.Item>
				<Menu.Item key="forms">
					<Link to="/forms">Forms</Link>
				</Menu.Item>
			</Menu>
		</Layout.Header>
	);
};

const App = () => {

	return (
		<Router>
			<Layout className>
				<Layout.Content>
					<Switch>
						<Route exact path="/">
							<Header selected={['home']} />
							<h1>Home !</h1>
						</Route>
						<Route path="/new">
							<Header selected={['new']} />
							<FormEditor />
						</Route>
						<Route path="/forms">
							<Header selected={['forms']} />
							<FormList formList={formListExample} />
						</Route>
						<Route path="/answers/:id">
							<AnswersPage />
						</Route>
						<Route path="/:id">
							<FillPage />
						</Route>
					</Switch>
				</Layout.Content>
			</Layout>
		</Router>
	);
};

const AnswersPage = () => {
	let { id } = useParams();
	return (
		<div>
			<h1>Form id: {id}</h1>
			<FormAnswers formSchema={formExample} formAnswers={answersExample} />
		</div>
	);
}

const FillPage = () => {
	let { id } = useParams();
	return (
		<div>
			<h1>Form id: {id}</h1>
			<FormFiller formSchema={formExample} />
		</div>
	);
}

export default App;
