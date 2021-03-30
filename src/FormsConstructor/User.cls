Class FormsConstructor.User Extends (%Persistent, %JSON.Adaptor)
{

Property Email As %String;

Storage Default
{
<Data name="ClientDefaultData">
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
