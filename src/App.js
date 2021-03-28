
import { FormFiller } from "./components/FormFiller";
import { formExample } from './testData';

const App = () => {

	return (
		<FormFiller formSchema={formExample} />
	);
}

export default App;
