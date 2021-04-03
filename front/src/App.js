
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, Avatar } from 'antd';
import 'antd/dist/antd.css';

import { FormAnswers } from "./components/FormAnswers";
import { FormEditor } from "./components/FormEditor";
import { FormList } from "./components/FormList";
import { FormFiller } from "./components/FormFiller";
import { formExample, answersExample, formListExample } from './testData';

import { Service as api } from './api';

const UserContext = React.createContext(null);

const Header = ({ selected, userEmail }) => {
	let user = userEmail ? userEmail[0] : '?';
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
				<	Menu.Item key="user"><Avatar>{user}</Avatar></Menu.Item>
			</Menu>

		</Layout.Header>
	);
};

const userEmail = "test@example.org"
const userId = 123;

const App = () => {
	const [user, setUser] = React.useState({ email: userEmail, id: userId });

	return (
		<UserContext.Provider value={user}>
			<Router>
				<Layout className>
					<Layout.Content>
						<Switch>
							<Route exact path="/">
								<Header selected={['home']} userEmail={userEmail} />
								<h1>Home !</h1>
							</Route>
							<Route path="/new">
								<Header selected={['new']} userEmail={userEmail} />
								<EditorPage />
							</Route>
							<Route path="/forms">
								<Header selected={['forms']} userEmail={userEmail} />
								<FormPage />
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
		</UserContext.Provider>
	);
};

const handle_errors = (response) => {
	if (response.error) {
		throw response;
	}
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

const FormPage = () => {
	const user = React.useContext(UserContext);
	const [formList, setFormList] = React.useState([]);
	React.useEffect(() => {
		async function fetch() {
			const res = await api.getForms(user.id);
			handle_errors(res);
			const forms = res.forms.map(f => ({
				id: f.id,
				title: f.title,
				description: f.subtitle,
				dateFrom: (new Date(1000 * f.available_from)).toLocaleString(),
				dataTo: (new Date(1000 * f.available_to)).toLocaleString(),
				link: f.link
			}))
			setFormList(forms);
		};
		fetch();
	}, []);

	return (
		<FormList formList={formList} />
	);
};

const EditorPage = () => {
	const user = React.useContext(UserContext);
	const history = useHistory();

	const onPublish = async ({schema, dates}) => {
		const [from, to] = dates;
		const form = {
			title: schema.title ?? "",
			subtitle: schema.description ?? "",
			available_from: from.unix(),
			available_to: to.unix(),
			json_schema: JSON.stringify(schema),
			fields: Object.entries(schema.properties).map(([name, prop], idx) => ({
				title: name,
				subtitle: prop.title ?? "",
				position: idx,
				type: prop.type == "boolean" ? "flag" : prop.type
			}))
		};
		console.log(form);
		const res = await api.createForm(user.id, form);
		handle_errors(res);
		history.push("/forms");
	};

	return (
		<FormEditor onPublish={onPublish}/>
	);
}

export default App;
