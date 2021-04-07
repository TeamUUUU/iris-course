Class FormsConstructor.Submissions Extends (%RegisteredObject, %JSON.Adaptor)
{

Parameter %JSONIGNOREINVALIDFIELD = 1;

Property Submissions As list Of FormsConstructor.Submission(%JSONFIELDNAME = "submissions");

Method ExportJSON() As %Status
{
    If (..Submissions.Count() = 0) {
        Set empty = {"submissions": []}
        Write empty.%ToJSON()
        Return $$$OK
    }
    Set sc = ..%JSONExport() 
    Return sc
}

}
