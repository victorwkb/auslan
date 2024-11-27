FROM public.ecr.aws/lambda/python:3.11-arm64

# Install the function's dependencies
COPY requirements.txt .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

COPY transform.py ${LAMBDA_TASK_ROOT}

# Set the entry point
CMD [ "transform.handler" ]
