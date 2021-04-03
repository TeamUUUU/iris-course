
import { withTheme } from '@rjsf/core';
import { Theme as AntDTheme } from '@rjsf/antd';
import 'antd/dist/antd.css';

const Form = withTheme(AntDTheme);

const defOnSubmit = data => console.log(data);

export const FormFiller = ({formSchema, onSubmit = defOnSubmit}) => {

	return (
		<Form schema={formSchema} onSubmit={({formData}) => onSubmit(formData)} />
	);
}
