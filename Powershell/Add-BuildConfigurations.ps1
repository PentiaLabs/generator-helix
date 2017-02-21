Function Add-BuildConfigurations {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectPath,
    [Parameter(Mandatory=$true)]
    [object[]]$Configurations)

    $propertyGroupCondition = "</PropertyGroup>" 
    foreach ($configuration in $Configurations)
    {    
        $configurationToAdd = $configuration.FullName.Replace(" ","")
        $addProjectBuildConfiguration = @("  <PropertyGroup Condition=`"'`$(Configuration)|`$(Platform)' == '$configurationToAdd'`">",
                                  "`t<DebugSymbols>true</DebugSymbols>",
                                  "`t<OutputPath>bin\</OutputPath>",
                                  "`t<DefineConstants>DEBUG;TRACE</DefineConstants>",
                                  "`t<DebugType>full</DebugType>",
                                  "`t<PlatformTarget>AnyCPU</PlatformTarget>",
                                  "`t<ErrorReport>prompt</ErrorReport>",
                                  "`t<CodeAnalysisRuleSet>MinimumRecommendedRules.ruleset</CodeAnalysisRuleSet>",
                                  "  </PropertyGroup>")

        Write-Output "Writing $configurationToAdd to $projectPath"                          
        Add-Line -FileName $projectPath -Pattern $propertyGroupCondition -LinesToAdd $addProjectBuildConfiguration
    }                               
}
