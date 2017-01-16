Function Get-ProjectConfigurationPlatformSection {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$Id,
    [Parameter(Mandatory=$true)]
    [object[]]$Configurations)

    $lines = New-Object System.Collections.ArrayList

    foreach($configuration in $Configurations)
    {
        $fullName = $configuration.FullName
        if($configuration.Name -eq "Debug")
        {
            $buildInherit = "Debug|Any CPU";
        }
        else {
            $buildInherit = "Release|Any CPU";
        }

        $lines.Add("`t`t{$Id}.$fullName.ActiveCfg = $buildInherit") | Out-Null
        $lines.Add("`t`t{$Id}.$fullName.Build.0 = $buildInherit")   | Out-Null
    }

    Write-Output $lines
}