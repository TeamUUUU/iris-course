Class FormsConstructor.Form Extends (%Persistent, %JSON.Adaptor)
{

Parameter %JSONIGNOREINVALIDFIELD = 1;

Property ID As %Integer(%JSONINCLUDE = "OUTPUTONLY") [ Identity ];

Property Title As %String(%JSONFIELDNAME = "title") [ Required ];

Property Subtitle As %String(%JSONFIELDNAME = "subtitle");

Property AvailableFrom As %PosixTime(%JSONFIELDNAME = "available_from") [ Required ];

Property AvailableTo As %PosixTime(%JSONFIELDNAME = "available_to") [ Required ];

Property JsonSchema As %String(%JSONFIELDNAME = "json_schema") [ Required ];

Property Link As %String(%JSONFIELDNAME = "link");

Property UserID As %Integer(%JSONFIELDNAME = "user_id") [ Transient ];

Relationship Fields As FormsConstructor.Field [ Cardinality = many, Inverse = Form ];

Relationship Submissions As FormsConstructor.Submission [ Cardinality = many, Inverse = Form ];

Relationship User As FormsConstructor.User [ Cardinality = one, Inverse = Forms ];

Index LinkIdx On Link [ Type = index, Unique ];

ClassMethod GenerateLink() As %String
{
    Set linkBytes = $SYSTEM.Encryption.GenCryptRand(18, 0)
    Set link = $SYSTEM.Encryption.Base64Encode(linkBytes)
    Return link
}

Query ByLink(Link As %String = "") As %SQLQuery(CONTAINID = 1, ROWSPEC = "ID:%Integer,Title:%String,Link:%String,AvailableFrom:%PosixTime,AvailableTo:%PosixTime,JsonSchema:%String,User:%Integer") [ SqlName = FC_Form_ByLink, SqlProc ]
{
SELECT ID, Title, Link, AvailableFrom, AvailableTo, JsonSchema, "User"
FROM FormsConstructor.Form
WHERE (%EXACT(Link) %STARTSWITH :Link)
}

Storage Default
{
<Data name="FormDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Title</Value>
</Value>
<Value name="3">
<Value>Subtitle</Value>
</Value>
<Value name="4">
<Value>AvailableFrom</Value>
</Value>
<Value name="5">
<Value>AvailableTo</Value>
</Value>
<Value name="6">
<Value>JsonSchema</Value>
</Value>
<Value name="7">
<Value>Link</Value>
</Value>
<Value name="8">
<Value>User</Value>
</Value>
</Data>
<DataLocation>^FormsConstructor.FormD</DataLocation>
<DefaultData>FormDefaultData</DefaultData>
<IdLocation>^FormsConstructor.FormD</IdLocation>
<IndexLocation>^FormsConstructor.FormI</IndexLocation>
<StreamLocation>^FormsConstructor.FormS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
