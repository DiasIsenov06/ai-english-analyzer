FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir flask requests
COPY bot.py .
EXPOSE 8080
CMD ["python", "bot.py"]
