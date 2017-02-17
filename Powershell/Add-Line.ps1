Function Add-Line {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$FileName,
    [Parameter(Mandatory=$true)]
    [string]$Pattern,
    [Parameter(Mandatory=$true)]
    [string[]]$LinesToAdd)
    
    $FileOriginal = Get-Content $FileName
    $hasBeenAdded = $false
    [String[]] $FileModified = @() 
    Foreach ($Line in $FileOriginal)
    {   
        $FileModified += $Line
        if ($Line.Trim() -eq $Pattern -and !$hasBeenAdded) 
        { 
            $FileModified += $LinesToAdd   
            $hasBeenAdded = $true;
        } 
    }
    Set-Content $fileName $FileModified -Force
}
