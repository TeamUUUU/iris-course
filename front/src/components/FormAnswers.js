
import { Table } from 'antd';
import 'antd/dist/antd.css';


export const FormAnswers = ({ formAnswers, formSchema }) => {

	const columns = Object.entries(formSchema.properties)
		.map(([field, data]) => {
			const title = data.title ?? field;
			switch (data.type) {
				case "boolean":
					return {
						title: title,
						dataIndex: field,
						render: val => val ? '✅' : '⛔',
						align: 'center'
					};
				case "number":
					return {
						title: title,
						dataIndex: field,
						align: 'right'
					};

				default:
					return {
						title: title,
						dataIndex: field,
						align: 'left'
					};
			}
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
