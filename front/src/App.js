
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
								<FormsPage />
							</Route>
							<Route path="/answers/:id">
								<Header selected={[]} userEmail={userEmail} />
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
	let { link } = useParams();
	const [schema, setSchema] = React.useState({});
	const [formId, setFormId] = React.useState(null);

	React.useEffect(() => {
		const fetch = async () => {
			const res = await api.getFormByLink(link);
			handle_errors(res);
			setSchema(res.json_schema);
			setFormId(res.id);
		};
		fetch();
	}, []);

	const onSubmit = async (formData) => {
		const res = await api.getFormFields(formId);
		handle_errors(res);
		const fields = res.fields.reduce((fields, f) =>
			({ [f.title]: f, ...fields }), {});
		console.log(fields);
		const submission = {
			date: moment().unix(),
			records: Object.entries(formData).map(([name, val]) => ({
				field_id: fields[name].field_id,
				value: val
			}))
		};
		console.log(submission);
		const res = await api.createFormSubmission(formId, submission);
		handle_errors(res);
	};

	return (
		<div>
			<h1>Form link: {link}</h1>
			<FormFiller formSchema={schema} onSubmit={onSubmit} />
		</div>
	);
}

const FormsPage = () => {
	const user = React.useContext(UserContext);
	const [formList, setFormList] = React.useState([]);
	React.useEffect(() => {
		const fetch = async () => {
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

	const onPublish = async ({ schema, dates }) => {
		const [from, to] = dates;
		const map_type = (type) => {
			switch (type) {
				case "boolean":
					return "flag";
				case "string":
					return "text";
				default:
					return type;
			}
		}
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
				type: map_type(prop.type)
			}))
		};
		console.log(form);
		const res = await api.createForm(user.id, form);
		handle_errors(res);
		history.push("/forms");
	};

	return (
		<FormEditor onPublish={onPublish} />
	);
}

export default App;
