
import { Table } from 'antd';
import 'antd/dist/antd.css';


export const FormAnswers = ({ formAnswers, formSchema }) => {

	const columns = Object.entries(formSchema.properties)
		.map(([field, data]) => {
			const title = data.title ?? field;
			if (data.type && data.type == "boolean") {
				return {
					title: title,
					dataIndex: field,
					record: val => val ? '✅' : '⛔'
				};
			}
			return {
				title: title,
				dataIndex: field,
			};
		});

	return (
		<Table dataSource={formAnswers.map((v, idx) => {
			return {
				key: idx,
				...v
			}
		})}
			columns={columns}
			pagination={false}
			sticky={true} />
	);
}
