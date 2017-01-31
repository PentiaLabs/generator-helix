Function Get-MSBuildPath
{
    [CmdletBinding()]
    Param()
    Resolve-Path HKLM:\SOFTWARE\Microsoft\MSBuild\ToolsVersions\* | Get-ItemProperty -Name MSBuildToolsPath | where { $_.PSChildName -eq "14.0"} | Select-Object -ExpandProperty MSBuildToolsPath
}