FINAL MODEL FILES

Files:
- model_loader.py
- retrain_model.py

Behavior:
- model_loader.py automatically selects the highest model version.
- retrain_model.py automatically trains from the latest model and saves the next version.

Supported names:
- final_purity_model1.pth
- final_purity_model_v2.pth
- final_purity_model_v3.pth

Required paths:
- classes.txt must be in the ai folder.
- Original dataset:
  E:\Oil-Adulteration-MERN-Structure\dataset\train
- Approved feedback:
  ai\retraining-data\approved-feedback

Commands:
- Retrain:
  python retrain_model.py

- Run FastAPI:
  python -m uvicorn main:app --host 127.0.0.1 --port 8000

Important:
Restart FastAPI after retraining so the latest model is loaded.
