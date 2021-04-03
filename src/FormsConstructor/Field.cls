Class FormsConstructor.Field Extends (%Persistent, %JSON.Adaptor)
{

Property ID As %Integer [ Identity ];

Property Type As %String(%JSONFIELDNAME = "type");

Property Title As %String(%JSONFIELDNAME = "title");

Property Subtitle As %String(%JSONFIELDNAME = "subtitle");

Property Position As %Integer(%JSONFIELDNAME = "position");

Relationship Form As FormsConstructor.Form [ Cardinality = one, Inverse = Fields ];

Index FormIndex On Form;

Storage Default
{
<Data name="FieldDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Type</Value>
</Value>
<Value name="3">
<Value>Title</Value>
</Value>
<Value name="4">
<Value>Subtitle</Value>
</Value>
<Value name="5">
<Value>Position</Value>
</Value>
<Value name="6">
<Value>Form</Value>
</Value>
</Data>
<DataLocation>^FormsConstructor.FieldD</DataLocation>
<DefaultData>FieldDefaultData</DefaultData>
<IdLocation>^FormsConstructor.FieldD</IdLocation>
<IndexLocation>^FormsConstructor.FieldI</IndexLocation>
<StreamLocation>^FormsConstructor.FieldS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
