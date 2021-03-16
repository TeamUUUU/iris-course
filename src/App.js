
import Form from "@rjsf/core";
import MonacoEditor from "react-monaco-editor";
import React from 'react';

const def_schema = `
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

const App = () => {



	const [text_schema, set_text_schema] = React.useState(def_schema);
	const [schema, set_schema] = React.useState(JSON.parse(def_schema));

	React.useEffect(() => {
		try {
			const parsed_schema = JSON.parse(text_schema);
			set_schema(parsed_schema);
		} catch (err) {
			// TODO: show error to user
		}
	}, [text_schema]);

	return (
		<div>
			<MonacoEditor
				language="json"
				value={text_schema}
				onChange={(new_val,) => set_text_schema(new_val)}
				height={400}
				options={{
					minimap: { enabled: false },
					automaticLayout: true,
				}}
			/>
			<Form schema={schema} />
		</div>
	);
}

export default App;
