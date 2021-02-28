Class App.Installer
{

XData setup
{
<Manifest>
  <Default Name="SourceDir" Value="#{$system.Process.CurrentDirectory()}src"/>
  <Default Name="Namespace" Value="IRISAPP"/>
  <Default Name="app" Value="irisapp" />

  <Namespace Name="${Namespace}" Code="${Namespace}" Data="${Namespace}" Create="yes" Ensemble="no">
    <Configuration>
      <Database Name="${Namespace}" Dir="/opt/${app}/data" Create="yes" Resource="%DB_${Namespace}"/>
      <Import File="${SourceDir}" Flags="ck" Recurse="1"/>
    </Configuration>
    <CSPApplication 
      Url="/csp/${app}" 
      Directory="${cspdir}${app}"
      ServeFiles="1" 
      Recurse="1" 
      MatchRoles=":%DB_${Namespace}" 
      AuthenticationMethods="64"
    />
  </Namespace>
  <Invoke Class="App.Installer" Method="RestWebApp" CheckStatus="true"></Invoke>
  <Invoke Class="App.Installer" Method="ModifyIrisapp" CheckStatus="true"></Invoke>

</Manifest>
}

ClassMethod setup(ByRef pVars, pLogLevel As %Integer = 3, pInstaller As %Installer.Installer, pLogger As %Installer.AbstractLogger) As %Status [ CodeMode = objectgenerator, Internal ]
{
  #; Let XGL document generate code for this method. 
  Quit ##class(%Installer.Manifest).%Generate(%compiledclass, %code, "setup")
}

ClassMethod RestWebApp() As %Status
{
  Set namespace = $NAMESPACE
  Zn "%SYS"
  Write "Create web application ..."
  Set webName = "/bmstuapi"
  Set webProperties("DispatchClass") = "API.REST"
  Set webProperties("NameSpace") = "IRISAPP"
  Set webProperties("Enabled") = 1
  Set webProperties("AutheEnabled") = 64
  Set webProperties("MatchRoles")=":%DB_IRISAPP"
  Set sc = ##class(Security.Applications).Create(webName, .webProperties)
  Write:'sc sc
  Write:sc "Web application "_webName_" has been created!"_$$$NL
  Zn namespace
  Return $$$OK
}

ClassMethod ModifyIrisapp() As %Status
{
  Set namespace = $NAMESPACE
  Zn "%SYS"
  Set webName = "/csp/irisapp"
  Set webProperties("MatchRoles")=":%DB_IRISAPP"
  Set sc = ##class(Security.Applications).Modify(webName, .webProperties)
  Write:'sc sc
  Write:sc "Web application "_webName_" has been modified!"_$$$NL
  Zn namespace
  Return $$$OK
}

}
