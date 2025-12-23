FROM python:3.10-slim

WORKDIR /app

COPY backend backend
COPY model model
COPY frontend frontend

RUN pip install --no-cache-dir -r backend/requirements.txt

EXPOSE 7860

CMD ["python", "backend/app.py"]
