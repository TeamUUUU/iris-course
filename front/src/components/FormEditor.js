
import React from 'react';

import { Row, Col, Button, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import Editor from "@monaco-editor/react";
import moment from 'moment';

import { withTheme } from '@rjsf/core';
import { Theme as AntDTheme } from '@rjsf/antd';

const Form = withTheme(AntDTheme);

const defSchema = `
{
	"title": "Test form",
	"type": "object",
	"properties": {
		"name": {
			"type": "string",
			"title": "Name"
		},
		"age": {
			"type": "number"
		},
		"agree": {
			"type": "boolean",
			"title": "I agree to EULA"
		}
	},
	"required": ["name"]
}
`;

const defOnPublish = (form) => console.log(form);

export const FormEditor = ({ onPublish = defOnPublish }) => {

	const [textSchema, setTextSchema] = React.useState(defSchema);
	const [schema, setSchema] = React.useState(JSON.parse(defSchema));
	const [dates, setDates] = React.useState([moment(), moment().add(1, 'y')]);

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
					<Editor
						language="json"
						value={textSchema}
						onChange={(newVal,) => setTextSchema(newVal)}
						height={400}
						options={{
							minimap: { enabled: false },
							automaticLayout: true,
						}}
					/>
					<div style={{ padding: "10px 10px 10px 10px" }}>
						<DatePicker.RangePicker onChange={(d) => setDates(d)} />
						<Button type="primary"
							onClick={() => onPublish({ schema: schema, dates: dates })}>
							Publish form
						</Button>
					</div>
				</Col>
				<Col span={12} style={{ padding: 10 }}>
					<h2>Preview</h2>
					<Form schema={schema} />
				</Col>
			</Row>
		</>
	);
}
