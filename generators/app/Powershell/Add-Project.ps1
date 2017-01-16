. $PSScriptRoot\Add-Line.ps1
. $PSScriptRoot\Get-SolutionConfigurations.ps1
. $PSScriptRoot\Get-SolutionFolderId.ps1
. $PSScriptRoot\Get-ProjectPath.ps1 
. $PSScriptRoot\Get-ProjectConfigurationPlatformSection.ps1

Function Add-Project {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("project", "feature", "foundation")]
    [string]$Type,
    [Parameter(Mandatory=$true)]
    [string]$SolutionFile,
    [Parameter(Mandatory=$true)]
    [string]$Name)

    $configurations = Get-SolutionConfigurations -SolutionFile $SolutionFile
    $solutionFolderId = Get-SolutionFolderId -SolutionFile $SolutionFile -Type $Type
    $projectPath = Get-ProjectPath -Type $Type -Name $Name

    $GuidSection = "GlobalSection(ProjectConfigurationPlatforms) = postSolution"
    $ProjectSection = "MinimumVisualStudioVersion = 10.0.40219.1"
    $NestedProjectSection = "GlobalSection(NestedProjects) = preSolution"
    $projectGuid = [guid]::NewGuid();

    $addProjectSection = @("Project(`"{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}`") = `"$Name`", `"$projectPath`", `"{$projectGuid}`"","EndProject")
    $addNestProjectSection = @("`t`t{$projectGuid} = $solutionFolderId")

    Add-Line -FileName $SolutionFile -Pattern $ProjectSection -LinesToAdd $addProjectSection
    Add-Line -FileName $SolutionFile -Pattern $NestedProjectSection -LinesToAdd $addNestProjectSection
    Add-Line -FileName $SolutionFile -Pattern $GuidSection -LinesToAdd (Get-ProjectConfigurationPlatformSection -Id $projectGuid -Configurations $configurations)
}