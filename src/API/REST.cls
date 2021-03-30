/// Description
Class API.REST Extends %CSP.REST
{

Parameter HandleCorsRequest = 1;

Parameter CONTENTTYPE = "application/json";

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
  <Route Url="/signup" Method="POST" Call="SignUp"/>
</Routes>
}

ClassMethod SignUp() As %Status
{

  Set cm = ##class(FormsConstructor.User).%JSONNew()
  Do cm.%JSONImport(%request.Content)
  Do cm.%JSONExportToString(.str)
  Do cm.%Save()
  write str
  Quit $$$OK
}

}
