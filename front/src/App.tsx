
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, Avatar } from 'antd';
import 'antd/dist/antd.css';
import moment, { Moment } from 'moment';

import { FormAnswers } from "./components/FormAnswers";
import { FormEditor } from "./components/FormEditor";
import { FormList } from "./components/FormList";
import { FormFiller } from "./components/FormFiller";
import { formExample, answersExample, formListExample } from './testData';

import { Service as api, Field, SubmissionCreate, FormCreate } from './api';
import { getResult } from './client';

type User = { email: string, id: number };
const UserContext = React.createContext<User>({ email: "", id: 0 });

const Header: React.FC<{ selected: [string] | [], userEmail: string }> = ({ selected, userEmail }) => {
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
	const [user, setUser] = React.useState<User>({ email: userEmail, id: userId });

	return (
		<UserContext.Provider value={user}>
			<Router>
				<Layout>
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

const AnswersPage = () => {
	let { id } = useParams<{ id: string }>();
	return (
		<div>
			<h1>Form id: {id}</h1>
			<FormAnswers formSchema={formExample} formAnswers={answersExample} />
		</div>
	);
}

const FillPage = () => {
	let { link } = useParams<{ link: string }>();
	const [schema, setSchema] = React.useState({});
	const [formId, setFormId] = React.useState(0);

	React.useEffect(() => {
		const fetch = async () => {
			const res = await api.getFormByLink(link);
			const form = getResult(res);
			const schema = JSON.parse(form.json_schema);
			setSchema(schema);
			setFormId(form.id);
		};
		fetch();
	}, []);

	const onSubmit = async (formData: { [key: string]: (boolean | string | number) }) => {
		const res1 = await api.getFormFields(formId);
		const formFields = getResult(res1);
		const fields: Map<string, Field> = formFields.fields.reduce((fields, f) =>
			({ [f.title]: f, ...fields }), new Map<string, Field>());
		console.log(fields);
		const submission: SubmissionCreate = {
			date: moment().unix(),
			records: Object.entries(formData).map(([name, val]) => ({
				field_id: fields.get(name)?.id,
				value: val
			}))
		};
		console.log(submission);
		const res2 = await api.createFormSubmission(formId, submission);
		getResult(res2);
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
	const [formList, setFormList] = React.useState<any>([]);
	React.useEffect(() => {
		const fetch = async () => {
			const res = await api.getForms(user.id);
			const forms = getResult(res).forms;
			const formList = forms.map(f => ({
				id: f.id,
				title: f.title,
				description: f.subtitle,
				dateFrom: (new Date(1000 * f.available_from)).toLocaleString(),
				dataTo: (new Date(1000 * f.available_to)).toLocaleString(),
				link: f.link
			}))
			setFormList(formList);
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

	const onPublish = async ({ schema, dates }: {schema:any, dates: [Moment, Moment]}) => {
		const [from, to] = dates;
		const map_type = (type: string) => {
			switch (type) {
				case "boolean":
					return "flag";
				case "string":
					return "text";
				case "number":
					return "number";
				default:
					throw "Unsupported field type: " + type
			}
		}
		const form: FormCreate = {
			title: schema.title ?? "",
			subtitle: schema.description ?? "",
			available_from: from.unix(),
			available_to: to.unix(),
			json_schema: JSON.stringify(schema),
			fields: Object.entries(schema.properties).map(([name, prop], idx) => ({
				title: name,
				subtitle: (prop as {title: string | undefined}).title ?? "",
				position: idx,
				type: map_type((prop as {type: string}).type)
			}))
		};
		console.log(form);
		const res = await api.createForm(user.id, form);
		getResult(res);
		history.push("/forms");
	};

	return (
		<FormEditor onPublish={onPublish} />
	);
}

export default App;
