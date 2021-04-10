
import React from 'react';

import { Service as api } from '../api';
import { getResult } from '../client';
import { FormList } from "../components/FormList";
import { useUser } from '../user'

export const FormsPage = () => {
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
