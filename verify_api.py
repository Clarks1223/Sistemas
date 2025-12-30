import urllib.request
import json
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"

def run_test(name, url, payload, expected_status):
    print(f"--- Testing {name} ---")
    req = urllib.request.Request(
        url, 
        data=json.dumps(payload).encode('utf-8'), 
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            print(f"Status: {status}")
            print(f"Body: {body[:200]}...") # Truncate for brevity
            if status == expected_status:
                print("RESULT: PASS")
            else:
                print(f"RESULT: FAIL (Expected {expected_status})")
    except urllib.error.HTTPError as e:
        print(f"Status: {e.code}")
        print(f"Body: {e.read().decode('utf-8')[:200]}...")
        if e.code == expected_status:
            print("RESULT: PASS")
        else:
            print(f"RESULT: FAIL (Expected {expected_status})")
    except Exception as e:
        print(f"Error: {e}")
        print("RESULT: FAIL")
    print("\n")

# Load payloads
with open('../c04_test.json', 'r') as f:
    c04_payload = json.load(f)

with open('../i02_test.json', 'r') as f:
    i02_payload = json.load(f)

# Test 1: C04 Creation
run_test("C04 Creation", f"{BASE_URL}/c04/", c04_payload, 201)

# Test 2: I02 Standard Creation (Should fail)
run_test("I02 Manual Creation", f"{BASE_URL}/i02/", i02_payload, 405)

# Test 3: I02 Generation (Should succeed)
run_test("I02 Generation", f"{BASE_URL}/i02/generate/", i02_payload, 201)
