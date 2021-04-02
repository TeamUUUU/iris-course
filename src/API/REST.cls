Class API.REST Extends %CSP.REST
{

Parameter HandleCorsRequest = 1;

Parameter CONTENTTYPE = "application/json";

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
      <Route Url="/users" Method="PUT" Call="CreateUser"/>
      <Route Url="/users" Method="GET" Call="GetUserByEmail"/>
      <Route Url="/users/:UserID/forms" Method="PUT" Call="PutForm"/>
      <Route Url="/users/:UserID/forms" Method="GET" Call="GetForms"/>
      <Route Url="/forms" Method="GET" Call="GetFormByLink"/>
      <Route Url="/forms/:FormID" Method="GET" Call="GetForm"/>
      <Route Url="/forms/:FormID/fields" Method="GET" Call="GetFieldsByForm"/>
      <Route Url="/forms/:FormID/submissions" Method="PUT" Call="PutSubmission"/>
      <Route Url="/forms/:FormID/submissions" Method="GET" Call="GetFormSubmissions"/>
    </Routes>
}

ClassMethod CreateUser() As %Status
{
    Try{
        Set cm = ##class(FormsConstructor.User).%New()
        Set sc= cm.%JSONImport(%request.Content)
        $$$ThrowOnError(sc)
        Do cm.%Save()
        Do cm.%JSONExport()
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
    Quit $$$OK
}

ClassMethod PutForm(UserID As %Integer) As %Status
{
    Try {
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

        Do form.%JSONExport()
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
    Quit $$$OK
}

ClassMethod GetForms(UserID As %Integer) As %Status
{
    Try {
        Set user = ##class(FormsConstructor.User).%OpenId(UserID)
        Set forms = ##class(FormsConstructor.Forms).%New()
        Set key = ""
        Do {
            Set form = user.Forms.GetNext(.key)
            If (form '= "") {
                Do forms.Forms.Insert(form)
            }
        } While (key '= "")

        Do forms.%JSONExport()
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
   Quit $$$OK
}

ClassMethod GetForm(FormID As %Integer) As %Status
{
    Set sc = $$$OK
    try {
        Set form = ##class(FormsConstructor.Form).%OpenId(FormID)
        Do form.%JSONExport()
    } catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
    Return sc
}

ClassMethod GetFormByLink() As %Status
{
    Set sc = $$$OK
    Set FormLink = $GET(%request.Data("link",1))
    Try {
        Set statement=##class(%SQL.Statement).%New()
        Set status=statement.%PrepareClassQuery("FormsConstructor.Form","ByLink")
        $$$ThrowOnError(status)
        Set stResults=statement.%Execute(FormLink)
        Do stResults.%Next()
        $$$ThrowOnError(stResults)
        Set form = ##class(FormsConstructor.Form).%OpenId(stResults.%Get("ID"))
        Set sc = form.%JSONExport()
        $$$ThrowOnError(sc)
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
    Return sc
}

ClassMethod GetFieldsByForm(FormID As %Integer) As %Status
{
    Set sc = $$$OK
    Try {
        Set form = ##class(FormsConstructor.Form).%OpenId(FormID)
        Set fields = ##class(FormsConstructor.Fields).%New()
        Set key = ""
        Do {
            Set field = form.Fields.GetNext(.key)
            If (field '= "") {
                Do fields.Fields.Insert(field)
            }
        } While (key '= "")

        Do fields.%JSONExport(.str)
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
   Quit $$$OK
}

ClassMethod PutSubmission(FormID As %Integer) As %Status
{
    Set sc = $$$OK
    Try {
        Set submission = ##class(FormsConstructor.Submission).%New()
        Set sc = submission.%JSONImport(%request.Content)
        $$$ThrowOnError(sc)
        Set recordsJson = {}.%FromJSON(%request.Content)
        Set iter = recordsJson.records.%GetIterator()
        While iter.%GetNext(.key , .value ) {
            If value.%Get("type") = "number" {
                Set nr = ##class(FormsConsctructor.NumberRecord).%New()
                Do nr.%JSONImport(value)
                Do submission.NumberRecords.Insert(nr)
            } 
            If value.%Get("type") = "text" {
                Set nr = ##class(FormsConsctructor.TextRecord).%New()
                Do nr.%JSONImport(value)
                Do submission.TextRecords.Insert(nr)
            }
            If value.%Get("type") = "flag" {
                Set nr = ##class(FormsConsctructor.FlagRecord).%New()
                Do nr.%JSONImport(value)
                Do submission.FlagRecords.Insert(nr)
            }
        }
        Do submission.FormSetObjectId(FormID)
        Do submission.%Save()
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
    Return sc
}

ClassMethod GetUserByEmail() As %Status
{
    Set sc = $$$OK
    Set email = $GET(%request.Data("email",1))
    Set user = ##class(FormsConstructor.User).GetUserByEmail(email)
    Do user.%JSONExport()
    // do something
    Return sc
}

ClassMethod GetFormSubmissions(FormID As %Integer) As %Status
{
    Set sc = $$$OK
    Try {
        Set submissions = ##class(FormsConsctructor.Submissions).%New()
        Set form = ##class(FormsConstructor.Form).%OpenId(FormID)
        Set key = ""
        Do {
            Set submission = form.Submissions.GetNext(.key)
            If (submission '= "") {
                Set sc = submission.FetchRecords()
                $$$ThrowOnError(sc)
                Do submissions.Submissions.Insert(submission)
            }
        } While (key '= "")
        Do submissions.%JSONExport()
    } Catch ex {
        Set status = $SYSTEM.Status.GetErrorText(ex.AsStatus())
        Set ret = {}
        Set ret.status = status
        Write ret.%ToJSON()
        Return ex
    }
    Return sc
}

}
