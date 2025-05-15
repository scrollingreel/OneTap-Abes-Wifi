from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    print(f"Received login for: {username}")

    url = "https://192.168.1.254:8090/httpclient.html"

    payload = {
        'mode': '191',
        'username': username,
        'password': password,
        'a': '1667191578446',
        'producttype': '0'
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://192.168.1.254:8090/httpclient.html'
    }

    try:
        session = requests.Session()
        response = session.post(url, data=payload, headers=headers, verify=False)

        print("Response text:", response.text)

        if "You have successfully logged in" in response.text:
            return jsonify({'status': 'success', 'message': 'Login successful ✅'})
        elif "maximum login limit" in response.text.lower():
            return jsonify({'status': 'failed', 'message': 'Maximum login limit reached ❌'})
        elif "Authentication Failed" in response.text:
            return jsonify({'status': 'failed', 'message': 'Wrong credentials ❌'})
        else:
            return jsonify({'status': 'failed', 'message': 'Unknown issue 😕'})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': 'Backend error ❗', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
