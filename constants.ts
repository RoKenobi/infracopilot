export const SAMPLE_ERRORS = [
  {
    type: "Kubernetes",
    log: 'Error from server (BadRequest): container "app" in pod "payment-service-7df85c9b5d-2xk9p" is waiting: CrashLoopBackOff'
  },
  {
    type: "AWS",
    log: 'An error occurred (ThrottlingException) when calling the AssumeRole operation: Rate exceeded'
  },
  {
    type: "Docker",
    log: 'docker: Error response from daemon: driver failed programming external connectivity on endpoint web (iptables failed)'
  }
];

export const PYTHON_SCRIPT_CONTENT = `import os
import argparse
import sys
import google.generativeai as genai
from dotenv import load_dotenv

# InfraCopilot: GenAI-powered troubleshooting for payment infrastructure incidents

def analyze_error(error_log):
    """
    Sends the error log to Gemini for SRE analysis.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("\\033[91mError: GEMINI_API_KEY not found in environment variables.\\033[0m")
        sys.exit(1)

    try:
        genai.configure(api_key=api_key)
        # Using a widely available stable model alias
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        system_prompt = (
            "You are an SRE at a global payments company. Analyze this infrastructure error and output EXACTLY in this format:\\n"
            "ROOT CAUSE: [1 sentence]\\n"
            "FIX: [concrete command or config change]\\n"
            "PREVENTION: [brief best practice]"
        )

        response = model.generate_content(f"{system_prompt}\\n\\nError Log:\\n{error_log}")
        
        # Simple formatting for terminal output
        print("-" * 40)
        print("INFRA COPILOT REPORT")
        print("-" * 40)
        print(response.text.strip())
        print("-" * 40)

    except Exception as e:
        print(f"\\033[91mConnection Error: {e}\\033[0m")
        sys.exit(1)

if __name__ == "__main__":
    load_dotenv()
    parser = argparse.ArgumentParser(description="InfraCopilot: SRE Troubleshooting Assistant")
    parser.add_argument("--error", required=True, help="Paste the infrastructure error log here")
    
    # Handle empty args gracefully if called without arguments
    if len(sys.argv) == 1:
        parser.print_help(sys.stderr)
        sys.exit(1)
        
    args = parser.parse_args()
    analyze_error(args.error)
`;

export const DOCKERFILE_CONTENT = `# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies if needed (none for this minimal tool)
# RUN apt-get update && apt-get install -y ...

# Install Python dependencies
RUN pip install --no-cache-dir google-generativeai python-dotenv

# Copy the script
COPY infra_copilot.py .

# Add placeholder for API key (should be passed at runtime)
ENV GEMINI_API_KEY=""

# Default command
ENTRYPOINT ["python", "infra_copilot.py"]
CMD ["--help"]
`;

export const ENV_EXAMPLE_CONTENT = `# Gemini API Key for InfraCopilot
GEMINI_API_KEY=your_api_key_here
`;

export const USAGE_EXAMPLE = `# 1. Build the image
docker build -t infra-copilot .

# 2. Run with an error log (pass API key via env var)
docker run --rm -e GEMINI_API_KEY=$GEMINI_API_KEY infra-copilot \\
  --error "Error from server (BadRequest): container 'app' in pod 'payment-service-7df85c9b5d-2xk9p' is waiting: CrashLoopBackOff"
`;