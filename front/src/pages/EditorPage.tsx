
import { useHistory } from "react-router-dom";
import { Moment } from 'moment';

import { Service as api, FormCreate } from '../api';
import { getResult } from '../client';
import { FormEditor } from "../components/FormEditor";
import { useUser } from '../user'

export const EditorPage = () => {
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
