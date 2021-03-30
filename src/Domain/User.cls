Class Domain.User Extends (%Persistent, %JSON.Adaptor)
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
<DataLocation>^Domain.UserD</DataLocation>
<DefaultData>UserDefaultData</DefaultData>
<IdLocation>^Domain.UserD</IdLocation>
<IndexLocation>^Domain.UserI</IndexLocation>
<StreamLocation>^Domain.UserS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
