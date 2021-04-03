Class FormsConstructor.Submission Extends (%Persistent, %JSON.Adaptor)
{

Parameter %JSONIGNOREINVALIDFIELD = 1;

Property ID As %Integer(%JSONFIELDNAME = "id", %JSONINCLUDE = "OUTPUTONLY") [ Identity ];

Property Date As %PosixTime(%JSONFIELDNAME = "date");

Property Records As list Of FormsConstructor.Records(%JSONFIELDNAME = "records") [ Transient ];

Relationship Form As FormsConstructor.Form [ Cardinality = one, Inverse = Submissions ];

Relationship TextRecords As FormsConstructor.TextRecord(%JSONINCLUDE = "none") [ Cardinality = many, Inverse = Submission ];

Relationship NumberRecords As FormsConstructor.NumberRecord(%JSONINCLUDE = "none") [ Cardinality = many, Inverse = Submission ];

Relationship FlagRecords As FormsConstructor.FlagRecord(%JSONINCLUDE = "none") [ Cardinality = many, Inverse = Submission ];

Method FetchRecords() As %Status
{
    Set sc = $$$OK
    Set key = ""
    Do {
        Set record = ..TextRecords.GetNext(.key)
        If (record '= "") {
            Do ..Records.Insert(record)
            
        }
    } While (key '= "")
    Do {
        Set record = ..NumberRecords.GetNext(.key)
        If (record '= "") {
            Do ..Records.Insert(record)
            
        }
    } While (key '= "")
    Do {
        Set record = ..FlagRecords.GetNext(.key)
        If (record '= "") {
            Do ..Records.Insert(record)
            
        }
    } While (key '= "")
    Return sc
}

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
