
import { FormAnswers } from "./components/FormAnswers";
import { formExample, answersExample } from './testData';

const App = () => {

	return (
		<FormAnswers formSchema={formExample} formAnswers={answersExample} />
	);
}

export default App;
