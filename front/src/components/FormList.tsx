
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { Link } from "react-router-dom";

export const FormList = ({ formList }: {formList: any}) => {

	const columns = [
		{
			title: 'Title',
			dataIndex: "title"
		},
		{
			title: 'Description',
			dataIndex: "description"
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
			render: (link: string) => <a href={link} >{link}</a>
		},
		{
			title: 'Action',
			key: 'action',
			render: (record: {id: number}) => (
				<Link to={`/answers/${record.id}`}>View results</Link>
			),
		},
	];

	return (
		<Table dataSource={formList.map((v: any) => {
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
