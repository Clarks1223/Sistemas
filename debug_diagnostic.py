import urllib.request
import urllib.error
import json

# Payload mimicking EXACTLY what the frontend sends (based on form logic)
payload = {
    "idType": "C",
    "idNumber": "1234567890",
    "operationNumber": "OP-TEST-001",
    "assetCode": "ASSET-001",
    "assetType": "110",
    "issuer": "Test Issuer",
    "issueDate": "01/01/2024",
    "maturityDate": "31/12/2024",
    "nominalValue": 5000.00,
    "accountingDate": "01/01/2024",
    "bookValue": 5000.00,
    "lastAppraisalValue": 5000.00,
    "provisionValue": 100.00,
    "realizationDate": None,  # Testing the fix
    "realizationValue": 0,
    "recordStatus": "N"
}

url = "http://127.0.0.1:8000/api/c04/"
headers = {'Content-Type': 'application/json'}

print("--- SENDING REQUEST ---")
try:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data, headers)
    with urllib.request.urlopen(req) as response:
        print(f"Success: {response.status}")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Failed: {e.code}")
    error_content = e.read().decode('utf-8')
    # Save error to file for analysis if it's long HTML
    with open('error_traceback.html', 'w', encoding='utf-8') as f:
        f.write(error_content)
    print("Error content saved to error_traceback.html")
    # Print first 500 chars to get an idea
    print(error_content[:1000])
except Exception as e:
    print(f"System Error: {e}")
