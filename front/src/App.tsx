
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import { Layout, Menu, Avatar } from 'antd';
import 'antd/dist/antd.css';

import { useLocalStorage } from './localStorage'
import { UserContext, User } from './user'
import { EditorPage } from './pages/EditorPage'
import { FormsPage } from './pages/FormsPage'
import { AnswersPage } from './pages/AnswersPage'
import { AuthPage } from './pages/AuthPage'
import { FillPage } from './pages/FillPage'

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
								<h1>Forms Constructor</h1>
								<h4>Code-First Typesafe Solution to Forms Building with JSON Schema</h4>
								<ul>
									<li><a href="https://github.com/TeamUUUU/iris-course">Source Code</a></li>
									<li>Developers 
									<ul>
										<li><a href="https://github.com/Dnnd">Danila Maslennikov</a></li>	
										<li><a href="https://github.com/Mvwivs">Vladimir Mazov</a></li>	
									</ul>
									</li>
								</ul>
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

export default App;
