FROM public.ecr.aws/lambda/python:3.11-arm64

# Install the function's dependencies
COPY requirements.txt .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy function code
COPY transform.py ${LAMBDA_TASK_ROOT}
COPY vectorize.py ${LAMBDA_TASK_ROOT}
COPY indexing.py ${LAMBDA_TASK_ROOT}
COPY query.py ${LAMBDA_TASK_ROOT}
