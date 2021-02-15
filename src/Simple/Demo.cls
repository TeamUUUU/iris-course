/// First Class
Class Simple.Demo
{

/// Hello world example
ClassMethod Hello(name As %String = "") As %Status
{
        Set sc = $$$OK
        

        If (name = "") {
            Write "Hello world!"
        } Else {
            Write "Hello "_name
        }


        Return sc
}

}
