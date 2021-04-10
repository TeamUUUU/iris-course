
import { withTheme } from '@rjsf/core';
import 'antd/dist/antd.css';
const { Theme: AntDTheme } = require('@rjsf/antd');

const Form = withTheme(AntDTheme);

export type FormData = { [key: string]: (boolean | string | number) };

const defOnSubmit = (data: FormData) => console.log(data);

export const FormFiller = ({formSchema = {}, onSubmit = defOnSubmit}) => {

	return (
		<Form schema={formSchema} onSubmit={({formData}) => onSubmit(formData)} />
	);
}
