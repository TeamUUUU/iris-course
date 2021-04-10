
import React from 'react';

import { useParams } from "react-router-dom";

import { Service as api, Field } from '../api';
import { getResult } from '../client';
import { FormAnswers, Answers } from "../components/FormAnswers";

export const AnswersPage = () => {
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
