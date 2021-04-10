
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, Avatar } from 'antd';
import 'antd/dist/antd.css';
import moment, { Moment } from 'moment';

import { Service as api, Field, SubmissionCreate, FormCreate } from './api';

import { FormAnswers, Answers } from "./components/FormAnswers";
import { FormEditor } from "./components/FormEditor";
import { FormList } from "./components/FormList";
import { FormFiller, FormData } from "./components/FormFiller";
import { SignUpIn } from "./components/SignUpIn";
import { getResult } from './client';
import { useLocalStorage } from './localStorage'

type User = { email: string, id: number } | null;
const UserContext = React.createContext<{ user: User, setUser: (user: User) => void }>({ user: null, setUser: () => { } });
const useUser = () => {
	const { user, setUser } = React.useContext(UserContext);
	if (!user) {
		throw Error("No user provided!");
	}
	return { user: user, setUser: setUser };
};

const Header: React.FC<{ selected: string[] }> = ({ selected }) => {
	const { user, setUser } = React.useContext(UserContext);
	const loggedIn = user !== null;
	const history = useHistory();

	const onMenuClick = ({ key }: any) => {
		console.log(key);
		if (key === 'sign_out') {
			setUser(null);
			history.push('/');
		}
	}
	return (
		<Layout.Header>
			<Menu mode="horizontal" theme="dark" defaultSelectedKeys={['1']} selectedKeys={selected} onClick={onMenuClick}>
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
							<Menu.SubMenu key="user"
								icon={
									<Avatar>{user?.email[0]}</Avatar>
								}
							>
								<>
									<Menu.Item>{user?.email}</Menu.Item>
									<Menu.Item key="sign_out">Sign Out</Menu.Item>
								</>
							</Menu.SubMenu>
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

const App = () => {
	const [user, setUser] = useLocalStorage<User | null>("user", null);

	return (
		<UserContext.Provider value={{ user: user, setUser: setUser }}>
			<Router>
				<Layout>
					<Switch>
						<Route exact path="/">
							<Header selected={['home']} />
							<Layout.Content className="content">
								<h1>Home !</h1>
							</Layout.Content>
						</Route>
						<Route path="/new">
							<Header selected={['new']} />
							<Layout.Content className="content">
								<EditorPage />
							</Layout.Content>
						</Route>
						<Route path="/forms">
							<Header selected={['forms']} />
							<Layout.Content className="content">
								<FormsPage />
							</Layout.Content>
						</Route>
						<Route path="/answers/:id">
							<Header selected={[]} />
							<Layout.Content className="content">
								<AnswersPage />
							</Layout.Content>
						</Route>
						<Route path="/sign_in">
							<Header selected={[]} />
							<Layout.Content className="content">
								<h1>Sign In</h1>
								<AuthPage signIn={true} />
							</Layout.Content>
						</Route>
						<Route path="/sign_up">
							<Header selected={[]} />
							<Layout.Content className="content">
								<h1>Sign Up</h1>
								<AuthPage signIn={false} />
							</Layout.Content>
						</Route>
						<Route path="/:link">
							<Header selected={[]} />
							<Layout.Content className="content">
								<FillPage />
							</Layout.Content>
						</Route>
					</Switch>
				</Layout>
			</Router>
		</UserContext.Provider>
	);
};

const AnswersPage = () => {
	const { id } = useParams<{ id: string }>();
	const [schema, setSchema] = React.useState<any>({ properties: {} });
	const [answers, setAnswers] = React.useState<Answers>([]);

	React.useEffect(() => {
		const fetch = async () => {
			const res1 = await api.getFormById(Number(id));
			const form = getResult(res1);
			console.log(form);
			const res2 = await api.getFormFields(form.id);
			const formFields = getResult(res2);
			console.log(formFields);
			const fields: { [key: number]: Field } = formFields.fields.reduce((fields, f) =>
				({ [f.id]: f, ...fields }), {});
			console.log(fields);
			const res3 = await api.getFormSubmissions(form.id);
			const formSubmissions = getResult(res3);
			console.log(formSubmissions);

			const answers: Answers = formSubmissions.submissions.map(submission => (
				submission.records.reduce((subm, record) =>
					({ [fields[record.field_id]?.title || ""]: record.value, ...subm }), {})
			));
			console.log(answers);

			setSchema(JSON.parse(form.json_schema));
			setAnswers(answers);
		};
		fetch();
	}, [id]);

	return (
		<>
			<h1>Form id: {id}</h1>
			<FormAnswers formSchema={schema} formAnswers={answers} />
		</>
	);
}

const FillPage = () => {
	const { link } = useParams<{ link: string }>();
	const [schema, setSchema] = React.useState<any>({});
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

	const onSubmit = async (formData: FormData) => {
		const res1 = await api.getFormFields(formId);
		const formFields = getResult(res1);
		const fields: { [key: string]: Field } = formFields.fields.reduce((fields, f) =>
			({ [f.title]: f, ...fields }), {});
		console.log(fields);
		const submission: SubmissionCreate = {
			date: moment().unix(),
			records: Object.entries(formData).map(([name, val]) => ({
				field_id: fields[name]?.id,
				value: val,
				type: fields[name]?.type
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
	const { user } = useUser();
	const [formList, setFormList] = React.useState<any>([]);
	React.useEffect(() => {
		const date_format = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
		const fetch = async () => {
			const res = await api.getForms(user.id);
			const forms = getResult(res).forms;
			const formList = forms.map(f => ({
				id: f.id,
				title: f.title,
				description: f.subtitle,
				dateFrom: date_format.format(new Date(1000 * f.available_from)),
				dateTo: date_format.format(new Date(1000 * f.available_to)),
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
	const { user } = useUser();
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

const AuthPage: React.FC<{ signIn: boolean }> = ({ signIn }) => {
	const history = useHistory();
	const { setUser } = React.useContext(UserContext);

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
