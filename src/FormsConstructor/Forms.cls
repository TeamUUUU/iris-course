Class FormsConstructor.Forms Extends (%RegisteredObject, %JSON.Adaptor)
{

Parameter %JSONIGNOREINVALIDFIELD = 1;

Property Forms As list Of FormsConstructor.Form(%JSONFIELDNAME = "forms");

Method ExportJSON() As %Status
{
    if (..Forms.Count() = 0) {
        Set empty = {"forms": []}
        Write empty.%ToJSON()
        Return $$$OK
    }
    Set sc = ..%JSONExport() 
    Return sc
}

}
