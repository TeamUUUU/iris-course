Class FormsConstructor.User Extends (%Persistent, %JSON.Adaptor)
{

Property ID As %Integer(%JSONINCLUDE = "OUTPUTONLY") [ Identity ];

Property Email As %String(%JSONFIELDNAME = "email");

Relationship Forms As FormsConstructor.Form [ Cardinality = many, Inverse = User ];

Storage Default
{
<Data name="UserDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Email</Value>
</Value>
</Data>
<DataLocation>^FormsConstructor.UserD</DataLocation>
<DefaultData>UserDefaultData</DefaultData>
<IdLocation>^FormsConstructor.UserD</IdLocation>
<IndexLocation>^FormsConstructor.UserI</IndexLocation>
<StreamLocation>^FormsConstructor.UserS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
