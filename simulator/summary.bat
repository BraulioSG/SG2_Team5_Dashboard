@echo off
for /l %%i in (1,1,100) do (
    python simulator/app.py >> output.csv
)
pause
