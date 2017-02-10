param(
[Parameter(Mandatory=$true)]
[ValidateSet("project", "feature", "foundation")]
[string]$Type,
[Parameter(Mandatory=$true)]
[string]$SolutionFile,
[Parameter(Mandatory=$true)]
[string]$Name,
[Parameter(Mandatory=$true)]
[string]$ProjectPath,
[Parameter(Mandatory=$true)]
[string]$SolutionFolderName)

. $PSScriptRoot\Add-Line.ps1
. $PSScriptRoot\Get-SolutionConfigurations.ps1
. $PSScriptRoot\Get-SolutionFolderId.ps1
. $PSScriptRoot\Get-ProjectPath.ps1 
. $PSScriptRoot\Get-ProjectConfigurationPlatformSection.ps1
. $PSScriptRoot\Add-BuildConfigurations.ps1

Write-Host "adding project $Name"

$configurations = Get-SolutionConfigurations -SolutionFile $SolutionFile
$solutionFolderId = Get-SolutionFolderId -SolutionFile $SolutionFile -Type $Type
$projectPath = "$ProjectPath\$name.csproj" 

$GuidSection = "GlobalSection(ProjectConfigurationPlatforms) = postSolution"
$ProjectSection = "MinimumVisualStudioVersion = 10.0.40219.1"
$NestedProjectSection = "GlobalSection(NestedProjects) = preSolution"
$projectGuid = [guid]::NewGuid();
$projectFolderGuid = [guid]::NewGuid();

$addProjectSection = @("Project(`"{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}`") = `"$Name`", `"$projectPath`", `"{$projectGuid}`"","EndProject")
$addProjectSolutionFolder = @("Project(`"{2150E333-8FDC-42A3-9474-1A3956D46DE8}`") = `"$SolutionFolderName`", `"$SolutionFolderName`", `"{$projectFolderGuid}`"","EndProject")

$addNestProjectSection = @("`t`t{$projectGuid} = {$projectFolderGuid}")
$addNestProjectSolutionFolderSection = @("`t`t{$projectFolderGuid} = $solutionFolderId")

Add-BuildConfigurations -ProjectPath $projectPath -Configurations $configurations                
Add-Line -FileName $SolutionFile -Pattern $ProjectSection -LinesToAdd $addProjectSection
Add-Line -FileName $SolutionFile -Pattern $ProjectSection -LinesToAdd $addProjectSolutionFolder
Add-Line -FileName $SolutionFile -Pattern $NestedProjectSection -LinesToAdd $addNestProjectSection
Add-Line -FileName $SolutionFile -Pattern $NestedProjectSection -LinesToAdd $addNestProjectSolutionFolderSection

Add-Line -FileName $SolutionFile -Pattern $GuidSection -LinesToAdd (Get-ProjectConfigurationPlatformSection -Id $projectGuid -Configurations $configurations)

#Setting LastWriteTime to tell VS 2015 that solution has changed.
Set-ItemProperty -Path $SolutionFile -Name LastWriteTime -Value (get-date)