@echo off
python simulator/app.py >> output.csv

move ./output.csv ./dashboard/public/data/results.csv

cd ./dashboard
npm install && start http://localhost:4321 && npm run dev
