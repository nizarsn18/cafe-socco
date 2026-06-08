' Lance le site Cafe Socco dans le navigateur par defaut
Set sh = CreateObject("WScript.Shell")
folder = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
indexPath = folder & "\index.html"

If Not CreateObject("Scripting.FileSystemObject").FileExists(indexPath) Then
    MsgBox "Fichier index.html introuvable dans:" & vbCrLf & folder, vbCritical, "Cafe Socco"
    WScript.Quit 1
End If

' Ouvre avec le navigateur par defaut (chemin file://)
sh.Run """" & indexPath & """", 1, False
