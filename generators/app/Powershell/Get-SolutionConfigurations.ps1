. $PSScriptRoot\Get-MSBuildPath.ps1 

Function Get-SolutionConfigurations {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$SolutionFile)

    $msbuildPath = Get-MSBuildPath
    Add-Type -Path "$msbuildPath\Microsoft.Build.dll"
    $solution = [Microsoft.Build.Construction.SolutionFile]::Parse($SolutionFile)
    $solution.SolutionConfigurations
}

