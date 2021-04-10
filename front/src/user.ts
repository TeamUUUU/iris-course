
import React from 'react';

export type User = { email: string, id: number } | null;
export const UserContext = React.createContext<{ user: User, setUser: (user: User) => void }>({ user: null, setUser: () => { } });

export const useUser = () => {
	const { user, setUser } = React.useContext(UserContext);
	if (!user) {
		throw Error("No user provided!");
	}
	return { user: user, setUser: setUser };
};
