. $PSScriptRoot\Get-MSBuildPath.ps1 

Function Get-SolutionFolderId {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$SolutionFile,
    [Parameter(Mandatory=$true)]
    [string]$type)
   
    $msbuildPath = Get-MSBuildPath
    Add-Type -Path "$msbuildPath\Microsoft.Build.dll"
    $solution = [Microsoft.Build.Construction.SolutionFile]::Parse($SolutionFile)
    $solution.ProjectsInOrder| where-object {$_.ProjectType -eq [Microsoft.Build.Construction.SolutionProjectType]::SolutionFolder } | where-object {$_.ProjectName -like "*$type*"} | Select-Object -ExpandProperty ProjectGuid
}

