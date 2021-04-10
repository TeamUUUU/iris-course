
import React from 'react';

import { useParams } from "react-router-dom";
import moment from 'moment';

import { Service as api, Field, SubmissionCreate } from '../api';
import { getResult } from '../client';
import { FormFiller, FormData } from "../components/FormFiller";

export const FillPage = () => {
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
