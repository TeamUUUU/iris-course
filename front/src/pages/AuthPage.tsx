
import React from 'react';

import { useHistory } from "react-router-dom";

import { SignUpIn } from "../components/SignUpIn";
import { Service as api } from '../api';
import { getResult } from '../client';
import { UserContext } from '../user'

export const AuthPage: React.FC<{ signIn: boolean }> = ({ signIn }) => {
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
