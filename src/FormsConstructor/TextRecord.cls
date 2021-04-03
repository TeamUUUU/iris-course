Class FormsConstructor.TextRecord Extends (%Persistent, FormsConstructor.Record)
{

Property Value As %String(%JSONFIELDNAME = "value");

Relationship Submission As FormsConstructor.Submission [ Cardinality = one, Inverse = TextRecords ];

Storage Default
{
<Data name="TextRecordDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Value</Value>
</Value>
<Value name="3">
<Value>Type</Value>
</Value>
<Value name="4">
<Value>FieldID</Value>
</Value>
<Value name="5">
<Value>Submission</Value>
</Value>
</Data>
<DataLocation>^FormsConstructor.TextRecordD</DataLocation>
<DefaultData>TextRecordDefaultData</DefaultData>
<IdLocation>^FormsConstructor.TextRecordD</IdLocation>
<IndexLocation>^FormsConstructor.TextRecordI</IndexLocation>
<StreamLocation>^FormsConstructor.TextRecordS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
