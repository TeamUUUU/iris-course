
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, Avatar } from 'antd';
import 'antd/dist/antd.css';
import moment, { Moment } from 'moment';

import { Service as api, Field, SubmissionCreate, FormCreate } from './api';

import { FormAnswers } from "./components/FormAnswers";
import { FormEditor } from "./components/FormEditor";
import { FormList } from "./components/FormList";
import { FormFiller } from "./components/FormFiller";
import { SignUpIn } from "./components/SignUpIn";
import { getResult } from './client';
import { useLocalStorage } from './localStorage'

type User = { email: string, id: number };
const UserContext = React.createContext<User | null>(null);
const useUser = () => {
	const user = React.useContext(UserContext);
	if (!user) {
		throw Error("No user provided!");
	}
	return user;
};

const Header: React.FC<{ selected: string[]}> = ({ selected }) => {
	const user = React.useContext(UserContext);
	const loggedIn = user !== null;

	return (
		<Layout.Header>
			<Menu mode="horizontal" theme="dark" defaultSelectedKeys={['1']} selectedKeys={selected}>
				<Menu.Item key="home">
					<Link to="/">Home</Link>
				</Menu.Item>
				{
					loggedIn
						? <>
							<Menu.Item key="new">
								<Link to="/new">New Form</Link>
							</Menu.Item>
							<Menu.Item key="forms">
								<Link to="/forms">Forms</Link>
							</Menu.Item>
							<Menu.Item key="user">
								<Avatar>{user?.email[0]}</Avatar>
							</Menu.Item>
						</>
						: <>
							<Menu.Item key="sign_in">
								<Link to="/sign_in">Sign In</Link>
							</Menu.Item>
							<Menu.Item key="sign_up">
								<Link to="/sign_up">Sign Up</Link>
							</Menu.Item>
						</>
				}
			</Menu>

		</Layout.Header>
	);
};

const userEmail = "test@example.org";
const userId = 123;

const App = () => {
	const [user, setUser] = useLocalStorage<User | null>("user", null);

	return (
		<UserContext.Provider value={user}>
			<Router>
				<Layout>
					<Layout.Content>
						<Switch>
							<Route exact path="/">
								<Header selected={['home']} />
								<h1>Home !</h1>
							</Route>
							<Route path="/new">
								<Header selected={['new']} />
								<EditorPage />
							</Route>
							<Route path="/forms">
								<Header selected={['forms']} />
								<FormsPage />
							</Route>
							<Route path="/answers/:link">
								<Header selected={[]} />
								<AnswersPage />
							</Route>
							<Route path="/sign_in">
								<AuthPage signIn={true} setUser={setUser} />
							</Route>
							<Route path="/sign_up">
								<AuthPage signIn={false} setUser={setUser} />
							</Route>
							<Route path="/:link">
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
	const { link } = useParams<{ link: string }>();
	const [schema, setSchema] = React.useState<any>();
	type Answers = { [key: string]: (string | boolean | number) }[];
	const [answers, setAnswers] = React.useState<Answers>();

	React.useEffect(() => {
		const fetch = async () => {
			const res1 = await api.getFormByLink(link);
			const form = getResult(res1);
			const res2 = await api.getFormFields(form.id);
			const formFields = getResult(res2);
			const fields: {[key: number]: Field} = formFields.fields.reduce((fields, f) =>
				({ [f.id]: f, ...fields }), {});
			const res3 = await api.getFormSubmissions(form.id);
			const formSubmissions = getResult(res3);

			const answers: Answers = formSubmissions.submissons.map(submission => (
				submission.records.reduce((subm, record) =>
					({ [fields[record.field_id]?.title || ""]: record.value, ...subm }), {})
			));

			setSchema(JSON.parse(form.json_schema));
			setAnswers(answers);
		};
		fetch();
	}, [link]);

	return (
		<>
			<h1>Form link: {link}</h1>
			<FormAnswers formSchema={schema} formAnswers={answers} />
		</>
	);
}

const FillPage = () => {
	const { link } = useParams<{ link: string }>();
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
	}, [link]);

	const onSubmit = async (formData: { [key: string]: (boolean | string | number) }) => {
		const res1 = await api.getFormFields(formId);
		const formFields = getResult(res1);
		const fields: {[key: string]: Field} = formFields.fields.reduce((fields, f) =>
			({ [f.title]: f, ...fields }), {});
		console.log(fields);
		const submission: SubmissionCreate = {
			date: moment().unix(),
			records: Object.entries(formData).map(([name, val]) => ({
				field_id: fields[name]?.id,
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
	const user = useUser();
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
	}, [user.id]);

	return (
		<FormList formList={formList} />
	);
};

const EditorPage = () => {
	const user = useUser();
	const history = useHistory();

	const onPublish = async ({ schema, dates }: { schema: any, dates: [Moment, Moment] }) => {
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
					throw Error("Unsupported field type: " + type)
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
				subtitle: (prop as { title: string | undefined }).title ?? "",
				position: idx,
				type: map_type((prop as { type: string }).type)
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

const AuthPage: React.FC<{ signIn: boolean, setUser: (user: User) => void }> = ({ signIn, setUser }) => {
	const history = useHistory();

	const onSignIn = async (data: any) => {
		const res = await api.getUser(data.email);
		const user = getResult(res);
		console.log(user);
		setUser(user);
		history.push('/');
	};

	const onSignUp = async (data: any) => {
		const res = await api.createUser({ email: data.email })
		const user = getResult(res);
		console.log(user);
		setUser(user);
		history.push('/');
	};

	const onSubmit = signIn ? onSignIn : onSignUp;
	return (
		<SignUpIn onSubmit={onSubmit} />
	);
}

export default App;
