param(
    [string]$filePath,
    [string]$targetMd
)

# Get relative path for the header
$currentDir = Get-Location
$relPath = $filePath.Replace($currentDir.Path + "\", "").Replace("\", "/")

# Determine language for code fence
$ext = [System.IO.Path]::GetExtension($filePath)
$lang = switch ($ext) {
    ".js" { "javascript" }
    ".json" { "json" }
    ".css" { "css" }
    ".html" { "html" }
    Default { "" }
}

# Append Header
Add-Content -Path $targetMd -Value "`n### $relPath`n```$lang" -Encoding UTF8

# Append Content
Get-Content $filePath | Add-Content -Path $targetMd -Encoding UTF8

# Append Footer
Add-Content -Path $targetMd -Value "```" -Encoding UTF8
