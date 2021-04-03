Class FormsConstructor.FlagRecord Extends (%Persistent, FormsConstructor.Record)
{

Property Value As %Boolean(%JSONFIELDNAME = "value");

Relationship Submission As FormsConstructor.Submission [ Cardinality = one, Inverse = FlagRecords ];

Storage Default
{
<Data name="FlagRecordDefaultData">
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
<DataLocation>^FormsConstructor.FlagRecordD</DataLocation>
<DefaultData>FlagRecordDefaultData</DefaultData>
<IdLocation>^FormsConstructor.FlagRecordD</IdLocation>
<IndexLocation>^FormsConstructor.FlagRecordI</IndexLocation>
<StreamLocation>^FormsConstructor.FlagRecordS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
