/// Description
Class API.REST Extends %CSP.REST
{

Parameter HandleCorsRequest = 1;

Parameter CONTENTTYPE = "application/json";

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
  <Route Url="/test" Method="GET" Call="Test"/>
</Routes>
}

ClassMethod Test() As %Status
{
  set c = ##class(Domain.User).%New()
  set c.Email = "kek@pep.ru"
  do c.%Save()
  set st = c.%JSONExportToString(.str)
  Return:($$$ISERR(st)) st
  write str
  return $$$OK
}

}
