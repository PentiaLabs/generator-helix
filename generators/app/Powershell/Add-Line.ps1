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
    [String[]] $FileModified = @() 
    Foreach ($Line in $FileOriginal)
    {   
        $FileModified += $Line
        if ($Line.Trim() -eq $Pattern) 
        { 
            $FileModified += $LinesToAdd   
        } 
    }
    Set-Content $fileName $FileModified
}
