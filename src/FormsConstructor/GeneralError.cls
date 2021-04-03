Class FormsConstructor.GeneralError Extends (%RegisteredObject, %JSON.Adaptor)
{

Property Error As %String(%JSONFIELDNAME = "error");

ClassMethod FromException(ex As %Exception.AbstractException) As FormsConstructor.GeneralError
{
        Set error = ##class(FormsConstructor.GeneralError).%New()
        Set errorText = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set error.Error = errorText
        return error
}

ClassMethod ExportException(ex As %Exception.AbstractException) As %Status
{
    Set error = ##class(FormsConstructor.GeneralError).FromException(ex)
    Set sc = error.%JSONExport()
    Return sc
}

}
