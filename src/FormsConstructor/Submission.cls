Class FormsConstructor.Submission Extends (%Persistent, %JSON.Adaptor)
{

Property ID As %Integer [ Identity ];

Property Date As %DateTime;

Relationship Form As FormsConstructor.Form [ Cardinality = one, Inverse = Submissions ];

Storage Default
{
<Data name="SubmissionDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Date</Value>
</Value>
<Value name="3">
<Value>Form</Value>
</Value>
</Data>
<DataLocation>^FormsConstructor.SubmissionD</DataLocation>
<DefaultData>SubmissionDefaultData</DefaultData>
<IdLocation>^FormsConstructor.SubmissionD</IdLocation>
<IndexLocation>^FormsConstructor.SubmissionI</IndexLocation>
<StreamLocation>^FormsConstructor.SubmissionS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
