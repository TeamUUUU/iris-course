Class FormsConstructor.NumberRecord Extends (%Persistent, FormsConstructor.Record)
{

Property Value As %Float(%JSONFIELDNAME = "value");

Relationship Submission As FormsConstructor.Submission [ Cardinality = one, Inverse = NumberRecords ];

Storage Default
{
<Data name="NumberRecordDefaultData">
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
<DataLocation>^FormsConsctru2D45.NumberRecordD</DataLocation>
<DefaultData>NumberRecordDefaultData</DefaultData>
<IdLocation>^FormsConsctru2D45.NumberRecordD</IdLocation>
<IndexLocation>^FormsConsctru2D45.NumberRecordI</IndexLocation>
<StreamLocation>^FormsConsctru2D45.NumberRecordS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
