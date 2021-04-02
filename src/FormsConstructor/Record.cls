Class FormsConsctructor.Record Extends %JSON.Adaptor [ Abstract ]
{

Property ID As %Integer(%JSONFIELDNAME = "id", %JSONINCLUDE = "OUTPUTONLY") [ Identity ];

Property Type As %String(%JSONFIELDNAME = "type");

Property FieldID As %Integer(%JSONFIELDNAME = "field_id");

ForeignKey FieldKey(FieldID) References FormsConstructor.Field() [ OnDelete = cascade ];

/// Description
Method GetField() As FormsConstructor.Field
{
    return ##class(FormsConstructor.Field).%OpenId(..ID)
}

}
