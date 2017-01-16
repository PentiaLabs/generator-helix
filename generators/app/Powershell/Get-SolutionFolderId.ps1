Function Get-SolutionFolderId {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$SolutionFile,
    [Parameter(Mandatory=$true)]
    [string]$type)

    Add-Type -Path "C:\Program Files (x86)\MSBuild\15.0\Bin\Microsoft.Build.dll"
    $solution = [Microsoft.Build.Construction.SolutionFile]::Parse($SolutionFile)
    $solution.ProjectsInOrder | where-object {$_.ProjectName -like "*$type*"} | Select-Object -ExpandProperty ProjectGuid
}

