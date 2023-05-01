@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\@grpc\grpc-js\node_modules\@grpc\proto-loader\build\bin\proto-loader-gen-types.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\@grpc\grpc-js\node_modules\@grpc\proto-loader\build\bin\proto-loader-gen-types.js" %*
)