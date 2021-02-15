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
  Set currentDate = $ZDate($Now(), 3)
  Set obj = {"msg":"It works","today": (currentDate)}
  Write obj.%ToJSON()
  Return $$$OK
}

}
