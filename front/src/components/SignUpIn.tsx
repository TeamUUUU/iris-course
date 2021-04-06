
import { Form, Button, Input } from 'antd';

const defOnSubmit = (value: any) => console.log(value);
export const SignUpIn = ({onSubmit = defOnSubmit}) => {

	return (
		<Form onFinish={onSubmit}>
			<Form.Item
				label="E-mail"
				name="email"
				rules={[{ required: true, message: 'Please input your email!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Submit
       			 </Button>
			</Form.Item>
		</Form>
	);
}
