
import { Table, Button } from 'antd';
import 'antd/dist/antd.css';

const defCallback = (r) => console.log(r);

export const FormList = ({ formList, onView = defCallback }) => {

	const columns = [
		{
			title: 'Title',
			dataIndex: "title"
		},
		{
			title: 'Date from',
			dataIndex: "dateFrom"
		},
		{
			title: 'Date to',
			dataIndex: "dateTo",
		},
		{
			title: 'Link',
			dataIndex: "link",
			render: link => <a href={link} >{link}</a>
		},
		{
			title: 'Action',
			key: 'action',
			render: (record) => (
				<Button onClick={() => onView(record.id)}>View results</Button>
			),
		},
	];

	return (
		<Table dataSource={formList.map((v) => {
			return {
				key: v.id,
				...v
			}
		})}
			columns={columns}
			pagination={false}
			sticky={true} />
	);
}
