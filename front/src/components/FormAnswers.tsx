
import { Table } from 'antd';
import 'antd/dist/antd.css';

export type Answers = { [key: string]: (string | boolean | number) }[];

export const FormAnswers = ({ formAnswers, formSchema }: { formAnswers: Answers, formSchema: any }) => {

	const columns = Object.entries(formSchema.properties)
		.map(([field, data]) => {
			const title: string = (data as any).title ?? field;
			switch ((data as any).type) {
				case "boolean":
					return {
						title: title,
						dataIndex: field,
						render: (val: boolean) => val ? '✅' : '⛔',
						align: 'center' as const
					};
				case "number":
					return {
						title: title,
						dataIndex: field,
						align: 'right' as const
					};

				default:
					return {
						title: title,
						dataIndex: field,
						align: 'left' as const
					};
			}
		});

	return (
		<Table expandable={{childrenColumnName: (Symbol() as any)}} dataSource={formAnswers.map((v, idx) => {
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
