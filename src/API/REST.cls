Class API.REST Extends %CSP.REST
{

Parameter HandleCorsRequest = 1;

Parameter CONTENTTYPE = "application/json";

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
      <Route Url="/users" Method="PUT" Call="CreateUser"/>
      <Route Url="/users/:UserID/forms" Method="PUT" Call="PutForm"/>
      <Route Url="/users/:UserID/forms" Method="GET" Call="GetForms"/>
      <Route Url="/forms/:FormLink" Method="GET" Call="GetFormByLink"/>
      <Route Url="/forms/:FormID/fields" Method="GET" Call="GetFieldsByForm"/>
    </Routes>
}

ClassMethod CreateUser() As %Status
{

    Set cm = ##class(FormsConstructor.User).%New()
    Set sc= cm.%JSONImport(%request.Content)
    If $$$ISERR(sc) {
        Set err = $SYSTEM.Status.GetErrorText(sc)
        Write err
        Quit sc
    }
    Do cm.%Save()
    Do cm.%JSONExportToString(.str)
    Write str
    Quit $$$OK
}

ClassMethod PutForm(UserID As %Integer) As %Status
{
    try {
    Set user = ##class(FormsConstructor.User).%OpenId(UserID)
    Set userID = user.%Id()
    Kill user
    Set form = ##class(FormsConstructor.Form).%New()

    Set sc = form.%JSONImport(%request.Content)
    $$$ThrowOnError(sc)

    Do form.UserSetObjectId(userID)
    Do form.%Save()

    Set fields = ##class(FormsConstructor.Fields).%New()

    Set sc = fields.%JSONImport(%request.Content)
    $$$ThrowOnError(sc)

    For i = 1:1:(fields.Fields.Count()) {
        Set field = fields.Fields.GetAt(i)
        Do form.Fields.Insert(field)
    }

    Set form.Link = ##class(FormsConstructor.Form).GenerateLink() 
    Set sc = form.%Save()
    $$$ThrowOnError(sc)

    Do form.%JSONExportToString(.str)
    Write str
    } catch ex {
        Set status = $System.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        write ret.%ToJSON()
        Return ex
    }
    Quit $$$OK
}

ClassMethod GetForms(UserID As %Integer) As %Status
{
    Set user = ##class(FormsConstructor.User).%OpenId(UserID)
    Set forms = ##class(FormsConstructor.Forms).%New()
    Set key = ""
    Do {
        Set form = user.Forms.GetNext(.key)
        If (form '= "") {
            Do forms.Forms.Insert(form)
        }
    } While (key '= "")

   Do forms.%JSONExportToString(.str)
   Write str
   Quit $$$OK
}

ClassMethod GetFormByLink(FormLink As %String) As %Status
{
    Set sc = $$$OK
    Set statement=##class(%SQL.Statement).%New()
    Set status=statement.%PrepareClassQuery("FormsConstructor.Form","ByLink")
    $$$ThrowOnError(status)
    Set stResults=statement.%Execute(FormLink)
    Do stResults.%Next()
    $$$ThrowOnError(stResults)
    Set form = ##class(FormsConstructor.Form).%New()
    Set form.ID = stResults.%Get("ID")
    Set form.Title = stResults.%Get("Title")
    Set form.Link = stResults.%Get("Link")
    set form.AvailableFrom = stResults.%Get("AvailableFrom")
    set form.AvailableTo = stResults.%Get("AvailableTo")
    set form.JsonSchema = stResults.%Get("JsonSchema")
    Set sc = form.%JSONExportToString(.str)
    $$$ThrowOnError(sc)
    Write str
    Return sc
}

ClassMethod GetFieldsByForm(FormID As %Integer) As %Status
{
    Set sc = $$$OK
    Set form = ##class(FormsConstructor.Form).%OpenId(FormID)
    Set fields = ##class(FormsConstructor.Fields).%New()
    Set key = ""
    Do {
        Set field = form.Fields.GetNext(.key)
        If (field '= "") {
            Do fields.Fields.Insert(field)
        }
    } While (key '= "")

   Do fields.%JSONExportToString(.str)
   Write str
   Quit $$$OK
}

}
