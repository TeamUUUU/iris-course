
import React from 'react';

import { Row, Col } from 'antd';
import 'antd/dist/antd.css';

import MonacoEditor from "react-monaco-editor";

import { withTheme } from '@rjsf/core';
import { Theme as AntDTheme } from '@rjsf/antd';

const Form = withTheme(AntDTheme);

const defSchema = `
{
	"title": "Test form",
	"type": "object",
	"properties": {
		"name": {
			"type": "string"
		},
		"age": {
			"type": "number"
		}
	}
}
`;

export const FormEditor = () => {

	const [textSchema, setTextSchema] = React.useState(defSchema);
	const [schema, setSchema] = React.useState(JSON.parse(defSchema));

	React.useEffect(() => {
		try {
			const parsedSchema = JSON.parse(textSchema);
			setSchema(parsedSchema);
		}
		catch (err) { // TODO: show error to user
		}
	}, [textSchema]);

	return (
		<>
			<Row>
				<Col span={12} style={{ padding: 10 }}>
					<h2>Form editor</h2>
					<MonacoEditor
						language="json"
						value={textSchema}
						onChange={(newVal,) => setTextSchema(newVal)}
						height={400}
						options={{
							minimap: { enabled: false },
							automaticLayout: true,
						}}
					/>
				</Col>
				<Col span={12} style={{ padding: 10 }}>
					<h2>Preview</h2>
					<Form schema={schema} />
				</Col>
			</Row>
		</>
	);
}
