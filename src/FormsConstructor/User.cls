Class FormsConstructor.User Extends (%Persistent, %JSON.Adaptor)
{

Property ID As %Integer(%JSONFIELDNAME = "id", %JSONINCLUDE = "OUTPUTONLY") [ Identity ];

Property Email As %String(%JSONFIELDNAME = "email");

Index EmailIdx On ID [ Type = index, Unique ];

Relationship Forms As FormsConstructor.Form(%JSONINCLUDE = "none") [ Cardinality = many, Inverse = User ];

ClassMethod GetUserByEmail(Email As %String) As FormsConstructor.User
{
        Set statement=##class(%SQL.Statement).%New()
        Set status=statement.%PrepareClassQuery("FormsConstructor.User","ByEmail")
        $$$ThrowOnError(status)
        Set stResults=statement.%Execute(Email)
        Do stResults.%Next()
        $$$ThrowOnError(stResults)
        Set id = stResults.%Get("ID")
        return ##class(FormsConstructor.User).%OpenId(id)
}

Query ByEmail(Email As %String = "") As %SQLQuery(CONTAINID = 1, ROWSPEC = "ID:%Integer") [ SqlName = User_By_Email, SqlProc ]
{
SELECT ID
FROM FormsConstructor."User"
WHERE (%EXACT(Email) %STARTSWITH :Email)
}

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
