Function Get-SolutionConfigurations {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$SolutionFile)

    Add-Type -Path "C:\Program Files (x86)\MSBuild\15.0\Bin\Microsoft.Build.dll"
    $solution = [Microsoft.Build.Construction.SolutionFile]::Parse($SolutionFile)
    $solution.SolutionConfigurations
}

