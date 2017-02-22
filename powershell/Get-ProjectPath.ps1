Function Get-ProjectPath {
    [CmdletBinding()]
    Param(
    [Parameter(Mandatory=$true)]
    [string]$name,
    [Parameter(Mandatory=$true)]
    [string]$type)

    "$type\$name\code\$name.csproj"
}

